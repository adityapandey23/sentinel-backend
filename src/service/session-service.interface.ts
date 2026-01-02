export interface SessionContext {
  ip: string;
  userAgent: any; // I know it's well typed
}

export interface SessionService {
  // This needs to be called at the time of register or login
  saveSession(userId: string, refreshToken: string, expiresAt: Date, context: SessionContext): Promise<void>; 

  // This needs to be called somewhere in the middleware maybe ?
  updateSession(): Promise<void>; 

  getSessions(): Promise<void>;

  // This should take up an optional parameter which avoid revoking that particular session
  deleteAllSessions(): Promise<void>; 
}
