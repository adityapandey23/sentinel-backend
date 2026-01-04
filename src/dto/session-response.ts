export type SessionResponse = {
  sessionId: string;

  // Geo info (nullable due to leftJoin)
  ip: string | null;
  countryCode: string | null;
  region: string | null;
  cityCode: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  offset: number | null;

  // User agent (nullable due to leftJoin)
  browser: string | null;
  os: string | null;
  isMobile: boolean | null;
  platform: string | null;
};
