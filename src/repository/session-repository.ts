import { session } from "@/db/schema";
import { TYPES } from "@/di/types";
import type { NewSession, Session } from "@/model";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { inject, injectable } from "inversify";
import { DatabaseError } from "@/errors";
import type { DbOrTransaction } from "@/db";

@injectable()
export class SessionRepository {
  constructor(@inject(TYPES.Database) private database: NodePgDatabase) {}

  // Basic CRUD operation functions
  async create(data: NewSession, tx?: DbOrTransaction): Promise<Session | undefined> {
    const db = tx ?? this.database;
    try {
      const [created] = await db.insert(session).values(data).returning();
      return created;
    } catch (error) {
      console.error("Database error in SessionRepository.create:", error);
      throw new DatabaseError("Failed to create session", error as Error);
    }
  }

  async findById(id: string, tx?: DbOrTransaction): Promise<Session | undefined> {
    const db = tx ?? this.database;
    try {
      const [found] = await db
        .select()
        .from(session)
        .where(eq(session.id, id));
      return found;
    } catch (error) {
      console.error("Database error in SessionRepository.findById:", error);
      throw new DatabaseError("Failed to find session by ID", error as Error);
    }
  }

  async update(id: string, data: Partial<NewSession>, tx?: DbOrTransaction): Promise<Session | undefined> {
    const db = tx ?? this.database;
    try {
      const [updated] = await db
        .update(session)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(session.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error("Database error in SessionRepository.update:", error);
      throw new DatabaseError("Failed to update session", error as Error);
    }
  }

  async delete(id: string, tx?: DbOrTransaction): Promise<Session | undefined> {
    const db = tx ?? this.database;
    try {
      const [deleted] = await db
        .delete(session)
        .where(eq(session.id, id))
        .returning();
      return deleted;
    } catch (error) {
      console.error("Database error in SessionRepository.delete:", error);
      throw new DatabaseError("Failed to delete session", error as Error);
    }
  }

  // Enhanced CRUD operation functions
  async findByUserId(userId: string, tx?: DbOrTransaction): Promise<Session | undefined> {
    const db = tx ?? this.database;
    try {
      const [found] = await db
        .select()
        .from(session)
        .where(eq(session.userId, userId));
      return found;
    } catch (error) {
      console.error("Database error in SessionRepository.findByUserId:", error);
      throw new DatabaseError("Failed to find session by user ID", error as Error);
    }
  }

  async findByToken(token: string, tx?: DbOrTransaction): Promise<Session | undefined> {
    const db = tx ?? this.database;
    try {
      const [found] = await db
        .select()
        .from(session)
        .where(eq(session.token, token));
      return found;
    } catch (error) {
      console.error("Database error in SessionRepository.findByToken:", error);
      throw new DatabaseError("Failed to find session by token", error as Error);
    }
  }
}
