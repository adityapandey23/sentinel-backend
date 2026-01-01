import { inject, injectable } from "inversify";
import type { SessionService } from "../session-service.interface";
import { TYPES } from "@/di/types";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

@injectable()
export class SessionServiceImpl implements SessionService {
    constructor(
        @inject(TYPES.Database) private database: NodePgDatabase,
    ) {}

    async saveSession(): Promise<void> {
    }

    async getSessions(): Promise<void> {
    }

    async updateSession(): Promise<void> {
    }

    async deleteAllSessions(): Promise<void> {
    }
}