import {
  controller,
  httpPost,
  request,
  response,
} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "@/di/types";

import type { interfaces } from "inversify-express-utils";
import type { Request, Response } from "express";
import type { AuthService } from "@/service/auth-service.interface";
import type { SessionContext } from "@/service/session-service.interface";

@controller("/api/auth")
export class AuthController implements interfaces.Controller {
  constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

  @httpPost("/register")
  private async register(@request() req: Request, @response() res: Response) {
    const context = <SessionContext> {
      ip: req.ip,
      userAgent: req.useragent,
    };

    const result = await this.authService.register(req.body, context);
    res.json({
      access_token: result.accessToken,
      refresh_token: result.refreshToken,
    });
  }

  @httpPost("/login")
  private async login(@request() req: Request, @response() res: Response) {
    const context = <SessionContext> {
      ip: req.ip,
      userAgent: req.useragent,
    };

    const result = await this.authService.login(req.body, context);
    res.json({
      access_token: result.accessToken,
      refresh_token: result.refreshToken,
    });
  }

  @httpPost("/token")
  private async token(@request() req: Request, @response() res: Response) {
    const context = <SessionContext> {
      ip: req.ip,
      userAgent: req.useragent,
    };

    const { refreshToken } = req.body;
    const accessToken = await this.authService.token(refreshToken, context);
    res.json({ accessToken });
  }
}
