const redis = require("redis");
const logger = require("../logger/logger");

const REDIS_URL = process.env.REDIS_URL;

const redisClient = redis.createClient({
  url: REDIS_URL,
});

redisClient.on("error", (err) => {
  logger.error("Redis Client Error", { error: err.message });
});

redisClient.on("connect", () => {
  logger.info("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
  process.exit(1);
});

module.exports = redisClient;
