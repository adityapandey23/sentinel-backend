export interface JwtPayload {
    sub: string,
    email?: string,
    role?: string,
    sid?: string,  // Session ID
    iat?: number,
    exp?: number
}

export interface JwtService {
    // Access Token
    signAccessToken(payload: JwtPayload): Promise<string>,
    verifyAccessToken(token: string): Promise<JwtPayload>,

    // Refresh Token
    signRefreshToken(payload: JwtPayload): Promise<string>,
    verifyRefreshToken(token: string): Promise<JwtPayload>,
}