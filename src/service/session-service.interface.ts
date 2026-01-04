import type { AgentDetails } from "express-useragent";
import type { DbOrTransaction } from "@/db";
import type { GetSessionResponse } from "@/dto/session-response";
import type { Session } from "@/model";

export interface SessionContext {
  ip: string;
  userAgent: AgentDetails;
}

export interface SessionService {
  // This needs to be called at the time of register or login
  // Accepts optional transaction for atomic operations with user creation
  saveSession(
    userId: string,
    sessionId: string,
    refreshToken: string,
    expiresAt: Date,
    context: SessionContext,
    tx?: DbOrTransaction,
  ): Promise<void>;

  // This needs to be called somewhere in the middleware maybe ?
  updateSession(
    sessionId: string,
    data: Partial<Session>,
    tx?: DbOrTransaction,
  ): Promise<void>;

  // This method is just to update the updatedAt timestamp
  updateLastActiveDetails(
    sessionId: string,
    tx?: DbOrTransaction,
  ): Promise<void>;

  getSessions(
    userId: string,
    tx?: DbOrTransaction,
  ): Promise<GetSessionResponse[]>;

  // Delete a specific session by ID (for revoking a specific session)
  deleteSession(
    userId: string,
    sessionId: string,
    tx?: DbOrTransaction,
  ): Promise<boolean>;

  // Delete all sessions except the current one
  deleteAllSessionsExcept(
    userId: string,
    currentSessionId: string,
    tx?: DbOrTransaction,
  ): Promise<number>;
}
