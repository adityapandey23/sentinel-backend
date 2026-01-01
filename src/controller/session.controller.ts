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

@controller("/api/sessions")
export class SessionController implements interfaces.Controller {
  constructor(
    @inject(TYPES.SessionService) private sessionService: SessionService
  ) {}

  @httpGet("/")
  private async getSessions(@request() req: Request, @response() res: Response) {
    res.json({
      message: "Got the sessions",
    });
  }


  @httpDelete("/others")
  private async deleteSessionsExceptCurrent(@request() req: Request, @response() res: Response) {
    console.log(req.ip);
    console.log(req.ips);
    res.json({
      message: "Other sessions deleted",
    });
  }

  @httpDelete("/:id")
  private async deleteSessionById(
    @requestParam("id") id: string,
    @request() req: Request,
    @response() res: Response
  ) {
    console.log(id);
    res.json({
      message: "Session deleted",
    });
  }

}
