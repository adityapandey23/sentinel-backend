import { 
  pgTable, 
  text,
  timestamp,
  inet,
  real,
  integer,
  boolean
} from 'drizzle-orm/pg-core';

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

  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),

  userId: text('user_id').references(() => user.id),
  geoInfoId: text('geo_info_id').references(() => geoInfo.id),
  userAgentId: text('user_agent_id').references(() => userAgent.id),

  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const geoInfo = pgTable('geo_info', {
  id: text('id').primaryKey(), // Will make this hash(IP)

  ip: inet('ip').notNull().unique(),
  countryCode: text('country_code'),
  region: text('region'),
  city: text('city'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  timezone: text('timezone'),
  offset: integer('offset'),

  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userAgent = pgTable('user_agent', {
  id: text('id').primaryKey(),

  browser: text('browser'),
  operatingSystem: text('operating_system'),
  isMobile: boolean('is_mobile').default(false),
  platform: text('platform'),

  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});
