const { verifyToken, generateToken } = require("../auth/jwt-auth");
const redisClient = require("../config/redis-config");
const logger = require("../utils/logger");

const JWT_ONE_DAY_EXPIRES = parseInt(process.env.JWT_ONE_DAY_EXPIRES);

async function validToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      logger.warn("Missing Authorization header");
      throw new Error("TOKEN REQUIRED");
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verifyToken(token);
    if (!decoded) {
      logger.warn("Invalid or expired token");
      throw new Error("INVALID TOKEN");
    }

    const redisKey = `user:${decoded.user_id}`;
    const storedToken = await redisClient.get(redisKey);

    if (!storedToken || storedToken !== token) {
      logger.warn(`Token mismatch for user:${decoded.user_id}`);
      throw new Error("INVALID TOKEN");
    }

    // Renovar token si está por expirar
    const ttl = await redisClient.ttl(redisKey);
    if (ttl < JWT_ONE_DAY_EXPIRES) {
      const newToken = await generateToken(decoded.user_id, decoded.role);
      res.setHeader("x-new-token", newToken);
      logger.info(`JWT renewed for user:${decoded.user_id}`);
    }

    req.user = { user_id: decoded.user_id, role: decoded.role };
    logger.debug(`Valid token for user:${decoded.user_id}`);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { validToken };
