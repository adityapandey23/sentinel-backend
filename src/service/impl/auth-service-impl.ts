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
import type { SessionContext, SessionService } from "../session-service.interface";
import type { UserRepository } from "@/repository/user-respository";
import { ConflictError, InternalError, NotFoundError, UnauthorizedError } from "@/errors";

@injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,

    @inject(TYPES.Database) private database: NodePgDatabase,
    @inject(TYPES.JwtService) private jwtService: JwtService,
    @inject(TYPES.SessionService) private sessionService: SessionService
  ) {}

  async login(dto: LoginDto, context: SessionContext): Promise<TokenPayload> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (!existingUser) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isValidPassword = await Bun.password.verify(
      dto.password,
      existingUser.password
    );

    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const payload: JwtPayload = {
      sub: existingUser.id,
      email: existingUser.email,
    };

    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    // I understand that this will lead to triggering the token expiration flag
    // before it's actually expired, though the time won't be significant but yeah
    // still worth mentioning

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAccessToken(payload),
      this.jwtService.signRefreshToken(payload),
    ]);

    await this.sessionService.saveSession(
      existingUser.id,
      refreshToken,
      refreshTokenExpiry,
      context
    );

    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto, context: SessionContext): Promise<TokenPayload> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    const hashedPassword = await Bun.password.hash(dto.password);

    const newUser = await this.userRepository.create({
      id: randomUUID(),
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    if (!newUser) {
      throw new InternalError("Failed to create user");
    }

    const payload: JwtPayload = {
      sub: newUser.id,
      email: newUser.email,
    };

    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAccessToken(payload),
      this.jwtService.signRefreshToken(payload),
    ]);

    await this.sessionService.saveSession(
      newUser.id,
      refreshToken,
      refreshTokenExpiry,
      context
    );

    return { accessToken, refreshToken };
  }

  async token(refreshToken: string): Promise<string> {
    const payload = await this.jwtService.verifyRefreshToken(refreshToken);

    const existingUser = await this.userRepository.findById(payload.sub);

    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    const newPayload: JwtPayload = {
      sub: existingUser.id,
      email: existingUser.email,
    };

    return this.jwtService.signAccessToken(newPayload);
  }
}
