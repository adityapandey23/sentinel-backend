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
import { eq } from "drizzle-orm";
import { user } from "@/db/schema";
import { randomUUID } from "crypto";

@injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @inject(TYPES.Database) private database: NodePgDatabase,
    @inject(TYPES.JwtService) private jwtService: JwtService
  ) {}

  async login(dto: LoginDto): Promise<TokenPayload> {
    const [existingUser] = await this.database
      .select()
      .from(user)
      .where(eq(user.email, dto.email))
      .limit(1);

      if(!existingUser) {
        throw new Error("Invalid email or password");
      }

      const isValidPassword = await Bun.password.verify(dto.password, existingUser.password);

      if(!isValidPassword) {
        throw new Error("Invalid email or password");
      }

      const payload: JwtPayload = {
        sub: existingUser.id,
        email: existingUser.email
      }

      const [ accessToken, refreshToken ] = await Promise.all([
        this.jwtService.signAccessToken(payload),
        this.jwtService.signRefreshToken(payload)
      ])

      return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto): Promise<TokenPayload> {
    const [existingUser] = await this.database
      .select()
      .from(user)
      .where(eq(user.email, dto.email))
      .limit(1);

      if(existingUser) {
        throw new Error("User with this email already exist");
      }

      const hashedPassword = await Bun.password.hash(dto.password);

      const userId = randomUUID();
      const [ newUser ] = await this.database
                            .insert(user)
                            .values({
                              id: userId,
                              name: dto.name,
                              email: dto.email,
                              password: hashedPassword
                            })
                            .returning();

      if(!newUser) {
        throw new Error("Failed to add new user")
      }

      const payload: JwtPayload = {
        sub: newUser.id,
        email: newUser.email
      }

      const [ accessToken, refreshToken ] = await Promise.all([
        this.jwtService.signAccessToken(payload),
        this.jwtService.signRefreshToken(payload)
      ])

      return { accessToken, refreshToken };
  }

  async token(refreshToken: string): Promise<string> {
    const payload = await this.jwtService.verifyRefreshToken(refreshToken);

    const [ existingUser ] = await this.database
                              .select()
                              .from(user)
                              .where(eq(user.id, payload.sub))
                              .limit(1);
    
    if(!existingUser) {
      throw new Error("User not found")
    }

    const newPayload: JwtPayload = {
      sub: existingUser.id,
      email: existingUser.email
    }

    return this.jwtService.signAccessToken(newPayload);
  }
}
