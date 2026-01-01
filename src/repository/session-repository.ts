import { session } from "@/db/schema";
import { TYPES } from "@/di/types";
import type { NewSession, Session } from "@/model";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { inject, injectable } from "inversify";

@injectable()
export class SessionRepository {
  constructor(@inject(TYPES.Database) private database: NodePgDatabase) {}

  // Basic CRUD operation functions
  async create(data: NewSession): Promise<Session | undefined> {
    const [created] = await this.database.insert(session).values(data).returning();

    return created;
  }

  async findById(id: string): Promise<Session | undefined> {
    const [found] = await this.database
      .select()
      .from(session)
      .where(eq(session.id, id))
      .limit(1);

    return found;
  }

  async update(id: string, data: Partial<NewSession>): Promise<Session | undefined> {
    const [updated] = await this.database
      .update(session)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(session.id, id))
      .returning();

    return updated;
  }

  async delete(id: string): Promise<Session | undefined> {
    const [deleted] = await this.database
      .delete(session)
      .where(eq(session.id, id))
      .returning();

    return deleted;
  }

  // Enhanced CRUD operation functions
}
