export interface SessionService {
    saveSession(): Promise<void> // This needs to be called at the time of register or login

    updateSession(): Promise<void> // This needs to be called somewhere in the middleware maybe ?

    getSessions(): Promise<void>

    deleteAllSessions(): Promise<void> // This should take up an optional parameter which avoid revoking that particular session
}