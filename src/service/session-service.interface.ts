import type { AgentDetails } from "express-useragent";

export interface SessionContext {
  ip: string;
  userAgent: AgentDetails;
}

export interface SessionService {
  // This needs to be called at the time of register or login
  saveSession(
    userId: string,
    refreshToken: string,
    expiresAt: Date,
    context: SessionContext
  ): void; 

  // This needs to be called somewhere in the middleware maybe ?
  updateSession(): Promise<void>; 

  getSessions(): Promise<void>;

  // This should take up an optional parameter which avoid revoking that particular session
  deleteAllSessions(): Promise<void>; 
}
