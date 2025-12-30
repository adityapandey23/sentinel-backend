import { pgTable, pgEnum, text, timestamp, boolean, real } from 'drizzle-orm/pg-core';

export const deviceTypeEnum = pgEnum('device_type', ['desktop', 'mobile', 'tablet', 'bot', 'unknown']);
export const browserEnum = pgEnum('browser', ['chrome', 'firefox', 'safari', 'edge', 'opera', 'brave', 'other']);
export const osEnum = pgEnum('os', ['windows', 'macos', 'linux', 'android', 'ios', 'other']);

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  // ─── IP & Network Info ─────────────────────────────────
  ipAddress: text('ip_address'),
  isp: text('isp'),
  isProxy: boolean('is_proxy'),
  isHosting: boolean('is_hosting'),

  // ─── Location ──────────────────────────────────────────
  country: text('country'),
  countryCode: text('country_code'),
  region: text('region'),
  regionName: text('region_name'),
  city: text('city'),
  zip: text('zip'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  timezone: text('timezone'),

  // ─── Device & User Agent ───────────────────────────────
  userAgent: text('user_agent'),              // Raw UA string (for debugging)
  deviceType: deviceTypeEnum('device_type'),
  browser: browserEnum('browser'),
  browserVersion: text('browser_version'),
  os: osEnum('os'),
  osVersion: text('os_version'),
});