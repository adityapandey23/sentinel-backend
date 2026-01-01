import { Container } from "inversify";
import { TYPES } from "./types";
import { db } from "@/db";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

// Importing Service Interfaces
import type { AuthService } from "@/service/auth-service.interface";
import type { ConfigService } from "@/service/config-service.interface";
import type { JwtService } from "@/service/jwt-service.interface";
import type { SessionService } from "@/service/session-service.interface";

// Importing Service Implementations
import { AuthServiceImpl } from "@/service/impl/auth-service-impl";
import { ConfigServiceImpl } from "@/service/impl/config-service-impl";
import { JwtServiceImpl } from "@/service/impl/jwt-service-impl";
import { SessionServiceImpl } from "@/service/impl/session-service-impl";

const container = new Container();

// Binding Service to the container
container.bind<NodePgDatabase>(TYPES.Database).toConstantValue(db);
container.bind<AuthService>(TYPES.AuthService).to(AuthServiceImpl);
container.bind<ConfigService>(TYPES.ConfigService).to(ConfigServiceImpl);
container.bind<JwtService>(TYPES.JwtService).to(JwtServiceImpl);
container.bind<SessionService>(TYPES.SessionService).to(SessionServiceImpl);

export {
    container
};