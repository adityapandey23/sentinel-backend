import { inject, injectable } from "inversify";
import type { JwtPayload, JwtService } from "../jwt-service.interface";
import { TYPES } from "@/di/types";
import type { ConfigService } from "../config-service.interface";
import { jwtVerify, SignJWT, type JWTPayload } from "jose";

@injectable()
export class JwtServiceImpl implements JwtService {
  private accessTokenSecret: Uint8Array;
  private refreshTokenSecret: Uint8Array;
  private accessTokenExpiry: string;
  private refreshTokenExpiry: string;

  constructor(
    @inject(TYPES.ConfigService) private configService: ConfigService,
  ) {
    this.accessTokenSecret = new TextEncoder().encode(
      this.configService.get("JWT_ACCESS_SECRET"),
    );

    this.refreshTokenSecret = new TextEncoder().encode(
      this.configService.get("JWT_REFRESH_SECRET"),
    );

    this.accessTokenExpiry = "15m";
    this.refreshTokenExpiry = "7d";
  }

  async signAccessToken(payload: JwtPayload): Promise<string> {
    return new SignJWT({ ...payload } as JWTPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(this.accessTokenExpiry)
      .setIssuer("sentinel")
      .setAudience("sentinel-api")
      .sign(this.accessTokenSecret);
  }

  async signRefreshToken(payload: JwtPayload): Promise<string> {
    return new SignJWT({ sub: payload.sub, sid: payload.sid } as JWTPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(this.refreshTokenExpiry)
      .setIssuer("sentinel")
      .setAudience("sentinel-api")
      .sign(this.refreshTokenSecret);
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    const { payload } = await jwtVerify(token, this.accessTokenSecret, {
      issuer: "sentinel",
      audience: "sentinel-api",
    });
    return payload as unknown as JwtPayload;
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    const { payload } = await jwtVerify(token, this.refreshTokenSecret, {
      issuer: "sentinel",
      audience: "sentinel-api",
    });
    return payload as unknown as JwtPayload;
  }
}
