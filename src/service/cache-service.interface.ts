export interface CacheService {
  setValue(key: string, value: string, ttlSeconds?: number): Promise<string>;
  getValue(key: string): Promise<string | null>;
}
