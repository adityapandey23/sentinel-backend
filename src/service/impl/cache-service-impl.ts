import { TYPES } from "@/di/types";
import type { CacheService } from "../cache-service.interface";
import { inject, injectable } from "inversify";
import type { ConfigService } from "../config-service.interface";

import { RedisClient } from "bun";

@injectable()
export class CacheServiceImpl implements CacheService {
  client: RedisClient;

  constructor(
    @inject(TYPES.ConfigService) private configService: ConfigService
  ) {
    this.client = new RedisClient(configService.get("REDIS_URL"));
  }

  async setValue(
    key: string,
    value: string,
    ttlSeconds?: number
  ): Promise<string> {
    if (ttlSeconds) {
      return await this.client.set(key, value, "EX", ttlSeconds);
    } else {
      return await this.client.set(key, value);
    }
  }

  async getValue(key: string): Promise<string | null> {
    return this.client.get(key);
  }
}
