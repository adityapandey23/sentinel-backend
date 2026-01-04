import { geoInfo } from "@/db/schema";
import { TYPES } from "@/di/types";
import type { GeoInfo, NewGeoInfo } from "@/model";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { inject, injectable } from "inversify";
import { DatabaseError } from "@/errors";
import type { DbOrTransaction } from "@/db";
import type { GeoInfoRepository } from "../geo-info-repository";

@injectable()
export class GeoInfoRepositoryImpl implements GeoInfoRepository {
  constructor(@inject(TYPES.Database) private database: NodePgDatabase) {}

  // Basic CRUD operation functions
  async create(
    data: NewGeoInfo,
    tx?: DbOrTransaction,
  ): Promise<GeoInfo | undefined> {
    const db = tx ?? this.database;
    try {
      const [created] = await db.insert(geoInfo).values(data).returning();
      return created;
    } catch (error) {
      console.error("Database error in GeoInfoRepository.create:", error);
      throw new DatabaseError("Failed to create geo info", error as Error);
    }
  }

  async findById(
    id: string,
    tx?: DbOrTransaction,
  ): Promise<GeoInfo | undefined> {
    const db = tx ?? this.database;
    try {
      const [found] = await db
        .select()
        .from(geoInfo)
        .where(eq(geoInfo.id, id))
        .limit(1);
      return found;
    } catch (error) {
      console.error("Database error in GeoInfoRepository.findById:", error);
      throw new DatabaseError("Failed to find geo info by ID", error as Error);
    }
  }

  async update(
    id: string,
    data: Partial<NewGeoInfo>,
    tx?: DbOrTransaction,
  ): Promise<GeoInfo | undefined> {
    const db = tx ?? this.database;
    try {
      const [updated] = await db
        .update(geoInfo)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(geoInfo.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error("Database error in GeoInfoRepository.update:", error);
      throw new DatabaseError("Failed to update geo info", error as Error);
    }
  }

  async delete(id: string, tx?: DbOrTransaction): Promise<GeoInfo | undefined> {
    const db = tx ?? this.database;
    try {
      const [deleted] = await db
        .delete(geoInfo)
        .where(eq(geoInfo.id, id))
        .returning();
      return deleted;
    } catch (error) {
      console.error("Database error in GeoInfoRepository.delete:", error);
      throw new DatabaseError("Failed to delete geo info", error as Error);
    }
  }

  // Enhanced CRUD operation functions
  async findByIp(
    ip: string,
    tx?: DbOrTransaction,
  ): Promise<GeoInfo | undefined> {
    const db = tx ?? this.database;
    try {
      const [found] = await db
        .select()
        .from(geoInfo)
        .where(eq(geoInfo.ip, ip))
        .limit(1);
      return found;
    } catch (error) {
      console.error("Database error in GeoInfoRepository.findByIp:", error);
      throw new DatabaseError("Failed to find geo info by IP", error as Error);
    }
  }
}
