import Baker from "cronbake";
import { db } from "@/db";
import { userAgent } from "@/db/schema";
import { sql } from "drizzle-orm";

const baker = Baker.create();

baker.add({
  name: "clean-up-orphaned-user-agent",
  cron: "0 30 3 * * *", // Runs at 3:30 AM every day (after session cleanup)
  start: true,
  callback: async () => {
    try {
      const now = new Date();
      const deleted = await db
        .delete(userAgent)
        .where(
          sql`NOT EXISTS (SELECT 1 FROM session WHERE session.user_agent_id = ${userAgent.id})`
        )
        .returning();

      console.log(
        `[Cron] Cleaned up ${deleted.length} orphaned user agent record(s) at ${now.toISOString()}`
      );
    } catch (error) {
      console.error("[Cron] Error cleaning up orphaned user agents:", error);
    }
  },
});

export { baker };