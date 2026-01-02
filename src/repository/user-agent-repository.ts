import { userAgent } from "@/db/schema";
import { TYPES } from "@/di/types";
import type { NewUserAgent, UserAgent } from "@/model";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { inject, injectable } from "inversify";
import { DatabaseError } from "@/errors";

@injectable()
export class UserAgentRepository {
  constructor(@inject(TYPES.Database) private database: NodePgDatabase) {}

  // Basic CRUD operation functions
  async create(data: NewUserAgent): Promise<UserAgent | undefined> {
    try {
      const [created] = await this.database.insert(userAgent).values(data).returning();
      return created;
    } catch (error) {
      console.error("Database error in UserAgentRepository.create:", error);
      throw new DatabaseError("Failed to create user agent", error as Error);
    }
  }

  async findById(id: string): Promise<UserAgent | undefined> {
    try {
      const [found] = await this.database
        .select()
        .from(userAgent)
        .where(eq(userAgent.id, id))
        .limit(1);
      return found;
    } catch (error) {
      console.error("Database error in UserAgentRepository.findById:", error);
      throw new DatabaseError("Failed to find user agent by ID", error as Error);
    }
  }

  async update(id: string, data: Partial<NewUserAgent>): Promise<UserAgent | undefined> {
    try {
      const [updated] = await this.database
        .update(userAgent)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(userAgent.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error("Database error in UserAgentRepository.update:", error);
      throw new DatabaseError("Failed to update user agent", error as Error);
    }
  }

  async delete(id: string): Promise<UserAgent | undefined> {
    try {
      const [deleted] = await this.database
        .delete(userAgent)
        .where(eq(userAgent.id, id))
        .returning();
      return deleted;
    } catch (error) {
      console.error("Database error in UserAgentRepository.delete:", error);
      throw new DatabaseError("Failed to delete user agent", error as Error);
    }
  }

  // Enhanced CRUD operation functions
}
