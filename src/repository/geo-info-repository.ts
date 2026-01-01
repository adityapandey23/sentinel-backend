import { geoInfo } from "@/db/schema";
import { TYPES } from "@/di/types";
import type { GeoInfo, NewGeoInfo } from "@/model";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { inject, injectable } from "inversify";

@injectable()
export class GeoInfoRepository {
  constructor(@inject(TYPES.Database) private database: NodePgDatabase) {}

  // Basic CRUD operation functions
  async create(data: NewGeoInfo): Promise<GeoInfo | undefined> {
    const [created] = await this.database.insert(geoInfo).values(data).returning();

    return created;
  }

  async findById(id: string): Promise<GeoInfo | undefined> {
    const [found] = await this.database
      .select()
      .from(geoInfo)
      .where(eq(geoInfo.id, id))
      .limit(1);

    return found;
  }

  async findByIp(ip: string): Promise<GeoInfo | undefined> {
    const [found] = await this.database
      .select()
      .from(geoInfo)
      .where(eq(geoInfo.ip, ip))
      .limit(1);

    return found;
  }

  async update(id: string, data: Partial<NewGeoInfo>): Promise<GeoInfo | undefined> {
    const [updated] = await this.database
      .update(geoInfo)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(geoInfo.id, id))
      .returning();

    return updated;
  }

  async delete(id: string): Promise<GeoInfo | undefined> {
    const [deleted] = await this.database
      .delete(geoInfo)
      .where(eq(geoInfo.id, id))
      .returning();

    return deleted;
  }

  // Enhanced CRUD operation functions
}
