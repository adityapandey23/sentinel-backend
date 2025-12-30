import type { TestService } from "../test-service.interface";


export class TestServiceImpl implements TestService {
    run(): string {
        return "Hello from TestServiceImpl";
    }
}