import { Container } from "inversify";
import { TYPES } from "./types";
import { db } from "@/db";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

// Importing Service Interfaces
import type { AuthService } from "@/service/auth-service.interface";
import type { CacheService } from "@/service/cache-service.interface";
import type { ConfigService } from "@/service/config-service.interface";
import type { IpService } from "@/service/ip-service.interface";
import type { JwtService } from "@/service/jwt-service.interface";
import type { QueueService } from "@/service/queue-service.interface";
import type { SessionService } from "@/service/session-service.interface";

// Importing Service Implementations
import { AuthServiceImpl } from "@/service/impl/auth-service-impl";
import { CacheServiceImpl } from "@/service/impl/cache-service-impl";
import { ConfigServiceImpl } from "@/service/impl/config-service-impl";
import { IpServiceImpl } from "@/service/impl/ip-service-impl";
import { JwtServiceImpl } from "@/service/impl/jwt-service-impl";
import { QueueServiceImpl } from "@/service/impl/queue-service-impl";
import { SessionServiceImpl } from "@/service/impl/session-service-impl";

// Importing Repository Interfaces
import type { GeoInfoRepository } from "@/repository/geo-info-repository";
import type { SessionRepository } from "@/repository/session-repository";
import type { UserAgentRepository } from "@/repository/user-agent-repository";
import type { UserRepository } from "@/repository/user-respository";

// Importing Repository Implementations
import { GeoInfoRepositoryImpl } from "@/repository/impl/geo-info-repository-impl";
import { SessionRepositoryImpl } from "@/repository/impl/session-repository-impl";
import { UserAgentRepositoryImpl } from "@/repository/impl/user-agent-repository-impl";
import { UserRepositoryImpl } from "@/repository/impl/user-repository-impl";

const container = new Container();

// Binding Service to the container
container.bind<AuthService>(TYPES.AuthService).to(AuthServiceImpl);
container.bind<CacheService>(TYPES.CacheService).to(CacheServiceImpl);
container.bind<ConfigService>(TYPES.ConfigService).to(ConfigServiceImpl);
container.bind<IpService>(TYPES.IpService).to(IpServiceImpl);
container.bind<NodePgDatabase>(TYPES.Database).toConstantValue(db);
container.bind<JwtService>(TYPES.JwtService).to(JwtServiceImpl);
container.bind<QueueService>(TYPES.QueueService).to(QueueServiceImpl);
container.bind<SessionService>(TYPES.SessionService).to(SessionServiceImpl);

// Binding Repository to the container
container.bind<GeoInfoRepository>(TYPES.GeoInfoRepository).to(GeoInfoRepositoryImpl);
container.bind<SessionRepository>(TYPES.SessionRepository).to(SessionRepositoryImpl);
container.bind<UserAgentRepository>(TYPES.UserAgentRepository).to(UserAgentRepositoryImpl);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);

export { container };
