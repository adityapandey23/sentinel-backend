import {
  controller,
  httpPost,
  request,
  response
} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "@/di/types";

import type { interfaces } from "inversify-express-utils";
import type { Request, Response } from "express";
import type { AuthService } from "@/service/auth-service.interface";

@controller("/api/auth")
export class AuthController implements interfaces.Controller {
    constructor(
        @inject(TYPES.AuthService) private authService: AuthService
    ) {}

    @httpPost("/register")
    private register(
        @request() req: Request, @response() res: Response
    ) {
        const result = this.authService.register();
        res.json({
            "message": result
        })
    }

    @httpPost("/login")
    private login(
        @request() req: Request, @response() res: Response
    ) {
        const result = this.authService.login();
        res.json({
            "message": result
        })
    }
}
