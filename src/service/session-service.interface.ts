import type { AgentDetails } from "express-useragent";
import type { DbOrTransaction } from "@/db";
import type { Session } from "@/model";
import type { SessionResponse } from "@/dto/session-response";

export interface SessionContext {
  ip: string;
  userAgent: AgentDetails;
}

export interface SessionService {
  // This needs to be called at the time of register or login
  // Accepts optional transaction for atomic operations with user creation
  saveSession(
    userId: string,
    refreshToken: string,
    expiresAt: Date,
    context: SessionContext,
    tx?: DbOrTransaction
  ): Promise<void>; 

  // This needs to be called somewhere in the middleware maybe ?
  updateSession(): Promise<void>; 

  getSessions(
    userId: string,
    tx?: DbOrTransaction
  ): Promise<SessionResponse[]>;

  // This should take up an optional parameter which avoid revoking that particular session
  deleteAllSessions(): Promise<void>; 
}
