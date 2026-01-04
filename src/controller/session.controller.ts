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
import { BadRequestError, NotFoundError } from "@/errors";
import { sessionUpdateMiddleware } from "@/middleware/session-update-middleware";

@controller("/api/sessions", authMiddleware, sessionUpdateMiddleware)
export class SessionController implements interfaces.Controller {
  constructor(
    @inject(TYPES.SessionService) private sessionService: SessionService,
  ) {}

  // TODO: Could add pagination as well
  @httpGet("/")
  private async getSessions(
    @request() req: Request,
    @response() res: Response,
  ) {
    const userId = req.user!.userId;
    const currentSessionId = req.user!.sessionId;

    const sessions = await this.sessionService.getSessions(userId);

    // Mark the current session in the response
    const sessionsWithCurrent = sessions.map((session) => ({
      ...session,
      isCurrent: session.sessionId === currentSessionId,
    }));

    res.json({
      sessions: sessionsWithCurrent,
    });
  }

  @httpDelete("/others")
  private async deleteSessionsExceptCurrent(
    @request() req: Request,
    @response() res: Response,
  ) {
    const userId = req.user!.userId;
    const currentSessionId = req.user!.sessionId;

    if (!currentSessionId) {
      throw new BadRequestError("Session ID not found in token");
    }

    const deletedCount = await this.sessionService.deleteAllSessionsExcept(
      userId,
      currentSessionId,
    );

    res.json({
      message: "Other sessions revoked successfully",
      deletedCount,
    });
  }

  @httpDelete("/:id")
  private async deleteSessionById(
    @requestParam("id") id: string,
    @request() req: Request,
    @response() res: Response,
  ) {
    const userId = req.user!.userId;
    const currentSessionId = req.user!.sessionId;

    // Prevent user from deleting their current session via this endpoint
    if (id === currentSessionId) {
      throw new BadRequestError(
        "Cannot revoke current session. Use logout instead.",
      );
    }

    const deleted = await this.sessionService.deleteSession(userId, id);

    if (!deleted) {
      throw new NotFoundError("Session not found");
    }

    res.json({
      message: "Session revoked successfully",
    });
  }
}
