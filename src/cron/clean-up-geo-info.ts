import Baker from "cronbake";
import { db } from "@/db";
import { geoInfo } from "@/db/schema";
import { sql } from "drizzle-orm";

const baker = Baker.create();

baker.add({
  name: "clean-up-orphaned-geo-info",
  cron: "0 30 3 * * *", // Runs at 3:30 AM every day (after session cleanup)
  start: true,
  callback: async () => {
    try {
      const now = new Date();
      const deleted = await db
        .delete(geoInfo)
        .where(
          sql`NOT EXISTS (SELECT 1 FROM session WHERE session.geo_info_id = ${geoInfo.id})`,
        )
        .returning();

      console.log(
        `[Cron] Cleaned up ${deleted.length} orphaned geo info record(s) at ${now.toISOString()}`,
      );
    } catch (error) {
      console.error("[Cron] Error cleaning up orphaned geo info:", error);
    }
  },
});

export { baker };
