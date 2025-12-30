import { Container } from "inversify";
import { TYPES } from "./types";

// Importing Service Interfaces
import type { AuthService } from "@/service/auth-service.interface";
import type { ConfigService } from "@/service/config-service.interface";

// Importing Service Implementations
import { AuthServiceImpl } from "@/service/impl/auth-service-impl";
import { ConfigServiceImpl } from "@/service/impl/config-service-impl";

const container = new Container();

// Binding Service to the container
container.bind<AuthService>(TYPES.AuthService).to(AuthServiceImpl);
container.bind<ConfigService>(TYPES.ConfigService).to(ConfigServiceImpl);

export {
    container
};