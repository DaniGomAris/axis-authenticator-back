const logger = require("@utils/logger");
const { createClient } = require("redis");

const REDIS_URL = process.env.REDIS_URL;

const redisClient = createClient({
  url: REDIS_URL
});

redisClient.on("error", (err) => logger.error("Redis Client Error:", err));
redisClient.on("connect", () => logger.info("Connected to Redis Cloud"));
redisClient.on("ready", () => logger.info("Redis client ready"));

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    logger.error("Redis connection failed:", err);
    process.exit(1);
  }
})();

module.exports = redisClient;
