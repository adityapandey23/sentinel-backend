import type { DbOrTransaction } from "@/db";
import type { GeoInfo, NewGeoInfo } from "@/model";

export interface GeoInfoRepository {
  create(data: NewGeoInfo, tx?: DbOrTransaction): Promise<GeoInfo | undefined>;
  findById(id: string, tx?: DbOrTransaction): Promise<GeoInfo | undefined>;
  update(
    id: string,
    data: Partial<NewGeoInfo>,
    tx?: DbOrTransaction,
  ): Promise<GeoInfo | undefined>;
  delete(id: string, tx?: DbOrTransaction): Promise<GeoInfo | undefined>;
  findByIp(ip: string, tx?: DbOrTransaction): Promise<GeoInfo | undefined>;
}
