import { user } from "@/db/schema";
import { TYPES } from "@/di/types";
import type { NewUser, User } from "@/model";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { inject, injectable } from "inversify";

@injectable()
export class UserRepository {
  constructor(@inject(TYPES.Database) private database: NodePgDatabase) {}

  // Basic CRUD operation functions
  async create(data: NewUser): Promise<User | undefined> {
    const [created] = await this.database.insert(user).values(data).returning();

    return created;
  }

  async findById(id: string): Promise<User | undefined> {
    const [found] = await this.database
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    return found;
  }

  async update(id: string, data: Partial<NewUser>): Promise<User | undefined> {
    const [updated] = await this.database
      .update(user)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(user.id, id))
      .returning();

    return updated;
  }

  async delete(id: string): Promise<User | undefined> {
    const [deleted] = await this.database
      .delete(user)
      .where(eq(user.id, id))
      .returning();

    return deleted;
  }

  // Enhanced CRUD operation functions
  async findByEmail(email: string): Promise<User | undefined> {
    const [found] = await this.database
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    return found;
  }
}
