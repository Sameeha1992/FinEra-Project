import { injectable } from "tsyringe";
import { IRedisService } from "../../interfaces/services/redis.interface";
import { redisClient } from "../../config/redis/redis.connect";

@injectable()
export class RedisService implements IRedisService {
  private readonly TTL_SECONDS = 10 * 60;
  async get(key: string): Promise<string | null> {
    return await redisClient.get(key);
  }

  async set(key: string, value: string, expiry: number): Promise<void> {
    await redisClient.set(key, value, { EX: expiry ?? 3600 });
  }

  async delete(key: string): Promise<void> {
    await redisClient.del(key);
  }

  async markUserVerified(
    email: string,type: 'user'|'vendor',
    TTL_SECONDS: number
  ): Promise<void> {
   

    const normalized = email.toLowerCase().trim()
    const key = `verified:${type}:${normalized}`;
    await this.set(key, "true", TTL_SECONDS);

  }

  async isUserVerified(
    email: string,
    type:'user'|'vendor',
  ): Promise<boolean> {
    const normalized = email.toLowerCase().trim()
    const key = `verified:${type}:${normalized}`;
    const result = await this.get(key);
    return result === "true";
  }

  async blacklistAccessToken(token: string, expiresAt: number): Promise<void> {
    const key = `blacklist:${token}`;
    await redisClient.set(key, "blacklisted", { EX: expiresAt });
  }

  async isAccessTokenBlacklisted(token: string): Promise<boolean> {
    const key = `blacklist:${token}`;
    const result = await this.get(key);
    return result === "blacklisted";
  }
}
