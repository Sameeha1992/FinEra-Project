import { createClient } from "redis";
import { config } from "../../shared/config/config";
import logger from "../../middleware/loggerMiddleware";


export const redisClient = createClient({
  password: config.redis.REDIS_PASS,
  socket: {
    host: config.redis.REDIS_HOST || 'redis',   
    port: Number(config.redis.REDIS_PORT) || 6379,
  },
});

redisClient.on("error", (error) => {
  logger.error({err:error},"Redis Client Error: ");
});

export async function connectRedis() {
  try {
    await redisClient.connect();
    logger.info("Redis connected successfully");
  } catch (error) {
    logger.error({err: error},"Redis connection failed: ");
    throw error;
  }
}