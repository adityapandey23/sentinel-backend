import type { AuthService } from "../auth-service.interface";
import { injectable } from "inversify";

@injectable()
export class AuthServiceImpl implements AuthService {
    login(): string {
        return "Login done";
    }

    register(): string {
        return "Registration done";
    }
}