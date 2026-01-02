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
      throw new Error(`user doesn't exist`);
    }

    const isValidPassword = await Bun.password.verify(
      dto.password,
      existingUser.password
    );

    if (!isValidPassword) {
      throw new Error(`invalid email or password`);
    }

    const payload: JwtPayload = {
      sub: existingUser.id,
      email: existingUser.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAccessToken(payload),
      this.jwtService.signRefreshToken(payload),
    ]);

    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto, context: SessionContext): Promise<TokenPayload> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new Error(`user already exist`);
    }

    const hashedPassword = await Bun.password.hash(dto.password);

    const newUser = await this.userRepository.create({
      id: randomUUID(),
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    if (!newUser) {
      throw new Error("failed to create new user");
    }

    const payload: JwtPayload = {
      sub: newUser.id,
      email: newUser.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAccessToken(payload),
      this.jwtService.signRefreshToken(payload),
    ]);

    return { accessToken, refreshToken };
  }

  async token(refreshToken: string, context: SessionContext): Promise<string> {
    const payload = await this.jwtService.verifyRefreshToken(refreshToken);

    const existingUser = await this.userRepository.findById(payload.sub);

    if (!existingUser) {
      throw new Error("user not found");
    }

    const newPayload: JwtPayload = {
      sub: existingUser.id,
      email: existingUser.email,
    };

    return this.jwtService.signAccessToken(newPayload);
  }
}
