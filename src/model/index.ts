import { user, session, geoInfo, userAgent } from "@/db/schema";

// Types for accessing the data from the database
export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type GeoInfo = typeof geoInfo.$inferSelect;
export type UserAgent = typeof userAgent.$inferSelect;

// Types for adding the data to the database
export type NewUser = typeof user.$inferInsert
export type NewSession = typeof session.$inferInsert;
export type NewGeoInfo = typeof geoInfo.$inferInsert;
export type NewUserAgent = typeof userAgent.$inferInsert;
