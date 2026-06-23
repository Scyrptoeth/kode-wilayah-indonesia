import { Redis } from "@upstash/redis";

let redisClient: Redis | null = null;

function getCentralStorageConfig() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.KV_REST_API_URL ??
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.KV_REST_API_TOKEN ??
    process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;

  return url && token ? { url, token } : null;
}

export function isCentralStorageConfigured() {
  return Boolean(getCentralStorageConfig());
}

export function getCentralRedis() {
  const config = getCentralStorageConfig();
  if (!config) {
    return null;
  }

  redisClient ??= new Redis(config);
  return redisClient;
}
