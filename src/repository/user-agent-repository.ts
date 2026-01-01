import { userAgent } from "@/db/schema";
import { TYPES } from "@/di/types";
import type { NewUserAgent, UserAgent } from "@/model";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { inject, injectable } from "inversify";

@injectable()
export class UserAgentRepository {
  constructor(@inject(TYPES.Database) private database: NodePgDatabase) {}

  // Basic CRUD operation functions
  async create(data: NewUserAgent): Promise<UserAgent | undefined> {
    const [created] = await this.database.insert(userAgent).values(data).returning();

    return created;
  }

  async findById(id: string): Promise<UserAgent | undefined> {
    const [found] = await this.database
      .select()
      .from(userAgent)
      .where(eq(userAgent.id, id))
      .limit(1);

    return found;
  }

  async update(id: string, data: Partial<NewUserAgent>): Promise<UserAgent | undefined> {
    const [updated] = await this.database
      .update(userAgent)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userAgent.id, id))
      .returning();

    return updated;
  }

  async delete(id: string): Promise<UserAgent | undefined> {
    const [deleted] = await this.database
      .delete(userAgent)
      .where(eq(userAgent.id, id))
      .returning();

    return deleted;
  }

  // Enhanced CRUD operation functions
}