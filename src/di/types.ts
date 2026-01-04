export const TYPES = {
    Database: Symbol.for("Database"),

    // Services
    AuthService: Symbol.for("AuthService"),
    CacheService: Symbol.for("CacheService"),
    ConfigService: Symbol.for("ConfigService"),
    IpService: Symbol.for("IpService"),
    JwtService: Symbol.for("JwtService"),
    SessionService: Symbol.for("SessionService"),

    // Repository
    GeoInfoRepository: Symbol.for("GeoInfoRepository"),
    SessionRepository: Symbol.for("SessionRepository"),
    UserAgentRepository: Symbol.for("UserAgentRepository"),
    UserRepository: Symbol.for("UserRepository"),
}