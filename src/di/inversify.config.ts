import { Container } from "inversify";
import { TYPES } from "./types";
import type { TestService } from "@/service/test-service.interface";
import { TestServiceImpl } from "@/service/impl/test-service-impl";

const container = new Container();

container.bind<TestService>(TYPES.TestServiceImpl).to(TestServiceImpl);

export {
    container
};