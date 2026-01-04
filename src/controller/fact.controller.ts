import { authMiddleware } from "@/middleware/auth-middleware";
import { sessionUpdateMiddleware } from "@/middleware/session-update-middleware";
import { getRandomCpTip } from "@/util/cp-fact";
import type { Request, Response } from "express";
import {
  controller,
  httpGet,
  request,
  response,
} from "inversify-express-utils";

import type { interfaces } from "inversify-express-utils";

@controller("/api/facts", authMiddleware, sessionUpdateMiddleware)
export class FactController implements interfaces.Controller {
  constructor() {}

  @httpGet("/")
  private getFacts(@request() req: Request, @response() res: Response) {
    const tip = getRandomCpTip();
    res.json({ Tip: tip });
  }
}
