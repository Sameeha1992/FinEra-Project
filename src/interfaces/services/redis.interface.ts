export interface IRedisService {
  get(key: string): Promise<string | null>;

  set(key: string, value: string, expiry?: number): Promise<void>;

  delete(key: string): Promise<void>;

  markUserVerified(email: string,type:'user'|'vendor', TTL_SECONDS: number): Promise<void>;

  isUserVerified(email: string,type:'user'|'vendor'): Promise<boolean>;

  blacklistAccessToken(token: string, expiresAt: number): Promise<void>;

  isAccessTokenBlacklisted(token: string): Promise<boolean>;
}
