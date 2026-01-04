import {
  controller,
  httpDelete,
  httpGet,
  request,
  response,
  requestParam,
} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "@/di/types";

import type { interfaces } from "inversify-express-utils";
import type { Request, Response } from "express";
import type { SessionService } from "@/service/session-service.interface";
import { authMiddleware } from "@/middleware/auth-middleware";

@controller("/api/sessions", authMiddleware)
export class SessionController implements interfaces.Controller {
  constructor(
    @inject(TYPES.SessionService) private sessionService: SessionService,
  ) {}

  @httpGet("/")
  private async getSessions(
    @request() req: Request,
    @response() res: Response
  ) {

    const userId = req.user!.userId;

    const response = await this.sessionService.getSessions(userId);

    res.json({
      userId,
      response
    });
  }

  @httpDelete("/others")
  private async deleteSessionsExceptCurrent(
    @request() req: Request,
    @response() res: Response
  ) {
    const userId = req.user!.userId;
    const email = req.user!.email;

    res.json({
      userId,
      email,
      Ip: req.ip,
      message: "Other sessions deleted",
    });
  }

  @httpDelete("/:id")
  private async deleteSessionById(
    @requestParam("id") id: string,
    @request() req: Request,
    @response() res: Response
  ) {
    const userId = req.user!.userId;
    const email = req.user!.email;

    res.json({
      userId,
      email,
      Ip: req.ip,
      message: "Sessions deleted",
    });
  }
}
