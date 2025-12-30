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
    login(dto: LoginDto): Promise<TokenPayload>
    register(dto: RegisterDto): Promise<TokenPayload>
    token(refreshToken: string): Promise<string>
}