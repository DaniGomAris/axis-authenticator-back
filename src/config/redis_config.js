const { createClient } = require("redis");
const logger = require("../logger/logger");

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) throw new Error("REDIS_URL no definido");

const redisClient = createClient({
  url: REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
});

redisClient.on("error", (err) => logger.error("Redis Client Error:", err));
redisClient.on("connect", () => logger.info("Connected to Redis (AWS ElastiCache)"));
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
