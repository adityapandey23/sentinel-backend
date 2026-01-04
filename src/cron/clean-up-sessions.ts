import Baker from "cronbake";
import { db } from "@/db";
import { session } from "@/db/schema";
import { lt } from "drizzle-orm";

const baker = Baker.create();

baker.add({
  name: "clean-up-expired-sessions",
  cron: "0 0 3 * * *", // Runs at 3:00 AM every day (second minute hour day month day-of-week)
  start: true,
  callback: async () => {
    try {
      const now = new Date();
      const deleted = await db
        .delete(session)
        .where(lt(session.expiresAt, now))
        .returning();

      console.log(
        `[Cron] Cleaned up ${deleted.length} expired session(s) at ${now.toISOString()}`,
      );
    } catch (error) {
      console.error("[Cron] Error cleaning up expired sessions:", error);
    }
  },
});

export { baker };
