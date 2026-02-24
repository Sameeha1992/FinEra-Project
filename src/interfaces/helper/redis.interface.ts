export interface IRedisService {
  get(key: string): Promise<string | null>;

  set(key: string, value: string, expiry?: number): Promise<void>;

  delete(key: string): Promise<void>;

  markUserVerified(email: string,type:'user'|'vendor', TTL_SECONDS: number): Promise<void>;

  isUserVerified(email: string,type:'user'|'vendor'): Promise<boolean>;

  blacklistRefreshToken(jiti: string, ttlSeconds: number): Promise<void>;

  isRefreshTokenBlacklisted(jiti: string): Promise<boolean>;
}
