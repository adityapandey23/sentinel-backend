import { TYPES } from "@/di/types";
import type {
  AuthService,
  LoginDto,
  RegisterDto,
  TokenPayload,
} from "../auth-service.interface";
import { inject, injectable } from "inversify";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { JwtPayload, JwtService } from "../jwt-service.interface";
import { randomUUID } from "crypto";
import type {
  SessionContext,
  SessionService,
} from "../session-service.interface";
import type { UserRepository } from "@/repository/user-respository";
import {
  ConflictError,
  InternalError,
  NotFoundError,
  UnauthorizedError,
} from "@/errors";

@injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,

    @inject(TYPES.Database) private database: NodePgDatabase,
    @inject(TYPES.JwtService) private jwtService: JwtService,
    @inject(TYPES.SessionService) private sessionService: SessionService,
  ) {}

  async login(dto: LoginDto, context: SessionContext): Promise<TokenPayload> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (!existingUser) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isValidPassword = await Bun.password.verify(
      dto.password,
      existingUser.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Generate session ID first so we can include it in JWT tokens
    const sessionId = randomUUID();

    const payload: JwtPayload = {
      sub: existingUser.id,
      email: existingUser.email,
      sid: sessionId,
    };

    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    // I understand that this will lead to triggering the token expiration flag
    // before it's actually expired, though the time won't be significant but yeah
    // still worth mentioning

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAccessToken(payload),
      this.jwtService.signRefreshToken(payload),
    ]);

    // Wrap session creation in a transaction to ensure atomicity
    // If any part fails, the entire operation rolls back
    await this.database.transaction(async (tx) => {
      await this.sessionService.saveSession(
        existingUser.id,
        sessionId,
        refreshToken,
        refreshTokenExpiry,
        context,
        tx,
      );
    });

    return { accessToken, refreshToken };
  }

  async register(
    dto: RegisterDto,
    context: SessionContext,
  ): Promise<TokenPayload> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    const hashedPassword = await Bun.password.hash(dto.password);

    // Generate IDs before transaction so we can use them inside
    const userId = randomUUID();
    const sessionId = randomUUID();
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // We need to generate the payload first, then tokens, then wrap DB ops in transaction
    // But we need the user to be created first to confirm success before generating tokens
    // So we'll create user in transaction, generate tokens after, then save session in same tx

    // Wrap user creation and session creation in a single transaction
    // If session creation fails, user creation is rolled back
    const { newUser, accessToken, refreshToken } =
      await this.database.transaction(async (tx) => {
        const created = await this.userRepository.create(
          {
            id: userId,
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
          },
          tx,
        );

        if (!created) {
          throw new InternalError("Failed to create user");
        }

        const payload: JwtPayload = {
          sub: created.id,
          email: created.email,
          sid: sessionId,
        };

        // Generate tokens (these don't involve DB, so safe to do inside tx)
        const [accessTkn, refreshTkn] = await Promise.all([
          this.jwtService.signAccessToken(payload),
          this.jwtService.signRefreshToken(payload),
        ]);

        // Save session within the same transaction
        await this.sessionService.saveSession(
          created.id,
          sessionId,
          refreshTkn,
          refreshTokenExpiry,
          context,
          tx,
        );

        return {
          newUser: created,
          accessToken: accessTkn,
          refreshToken: refreshTkn,
        };
      });

    return { accessToken, refreshToken };
  }

  async token(refreshToken: string): Promise<string> {
    const payload = await this.jwtService.verifyRefreshToken(refreshToken);

    const existingUser = await this.userRepository.findById(payload.sub);

    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    // Preserve the session ID when refreshing the access token
    const newPayload: JwtPayload = {
      sub: existingUser.id,
      email: existingUser.email,
      sid: payload.sid,
    };

    return this.jwtService.signAccessToken(newPayload);
  }
}
