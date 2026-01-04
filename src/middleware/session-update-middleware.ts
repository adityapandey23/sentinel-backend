import { container } from "@/di/inversify.config";
import { TYPES } from "@/di/types";
import { InternalError, UnauthorizedError } from "@/errors";
import type { CacheService } from "@/service/cache-service.interface";
import type { SessionService } from "@/service/session-service.interface";
import type { Request, Response, NextFunction } from "express";

export async function sessionUpdateMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const cacheService = container.get<CacheService>(TYPES.CacheService);
    const sessionService = container.get<SessionService>(TYPES.SessionService);

    if (!req.user?.sessionId) {
      throw new UnauthorizedError("Session ID not found");
    }

    const recentRequest = await cacheService.getValue(req.user?.sessionId);

    if (!recentRequest) {
      // Not found, so need to update
      await sessionService.updateLastActiveDetails(req.user.sessionId);
      await cacheService.setValue(req.user.sessionId, "YES", 300); // 5 Minutes
    }

    next();
  } catch (error) {
    next(new InternalError("Cache service is down"));
  }
}
