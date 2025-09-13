const redis = require("redis");

const REDIS_URL = process.env.REDIS_URL;

const redisClient = redis.createClient({
  url: REDIS_URL
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

module.exports = redisClient;
