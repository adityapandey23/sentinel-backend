import type { SessionContext } from "./session-service.interface"

export interface TokenPayload {
    accessToken: string
    refreshToken: string
}

export interface LoginDto {
    email: string
    password: string
}

export interface RegisterDto {
    name: string
    email: string
    password: string
}

export interface AuthService {
    login(dto: LoginDto, context: SessionContext): Promise<TokenPayload>
    register(dto: RegisterDto, context: SessionContext): Promise<TokenPayload>
    token(refreshToken: string): Promise<string>
}