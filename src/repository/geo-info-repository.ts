import { geoInfo } from "@/db/schema";
import { TYPES } from "@/di/types";
import type { GeoInfo, NewGeoInfo } from "@/model";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { inject, injectable } from "inversify";
import { DatabaseError } from "@/errors";

@injectable()
export class GeoInfoRepository {
  constructor(@inject(TYPES.Database) private database: NodePgDatabase) {}

  // Basic CRUD operation functions
  async create(data: NewGeoInfo): Promise<GeoInfo | undefined> {
    try {
      const [created] = await this.database.insert(geoInfo).values(data).returning();
      return created;
    } catch (error) {
      console.error("Database error in GeoInfoRepository.create:", error);
      throw new DatabaseError("Failed to create geo info", error as Error);
    }
  }

  async findById(id: string): Promise<GeoInfo | undefined> {
    try {
      const [found] = await this.database
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

  async update(id: string, data: Partial<NewGeoInfo>): Promise<GeoInfo | undefined> {
    try {
      const [updated] = await this.database
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

  async delete(id: string): Promise<GeoInfo | undefined> {
    try {
      const [deleted] = await this.database
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
  async findByIp(ip: string): Promise<GeoInfo | undefined> {
    try {
      const [found] = await this.database
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
