import { userAgent } from "@/db/schema";
import { TYPES } from "@/di/types";
import type { NewUserAgent, UserAgent } from "@/model";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { inject, injectable } from "inversify";
import { DatabaseError } from "@/errors";
import type { DbOrTransaction } from "@/db";

@injectable()
export class UserAgentRepository {
  constructor(@inject(TYPES.Database) private database: NodePgDatabase) {}

  // Basic CRUD operation functions
  async create(data: NewUserAgent, tx?: DbOrTransaction): Promise<UserAgent | undefined> {
    const db = tx ?? this.database;
    try {
      const [created] = await db.insert(userAgent).values(data).returning();
      return created;
    } catch (error) {
      console.error("Database error in UserAgentRepository.create:", error);
      throw new DatabaseError("Failed to create user agent", error as Error);
    }
  }

  async findById(id: string, tx?: DbOrTransaction): Promise<UserAgent | undefined> {
    const db = tx ?? this.database;
    try {
      const [found] = await db
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

  async update(id: string, data: Partial<NewUserAgent>, tx?: DbOrTransaction): Promise<UserAgent | undefined> {
    const db = tx ?? this.database;
    try {
      const [updated] = await db
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

  async delete(id: string, tx?: DbOrTransaction): Promise<UserAgent | undefined> {
    const db = tx ?? this.database;
    try {
      const [deleted] = await db
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
