const { verifyToken, generateToken } = require("../auth/jwt-auth");
const redisClient = require("../config/redis-config");
const { handleError } = require("../handlers/error-handler");
const STATUS = require("../constants/status-constants");

const JWT_ONE_DAY_EXPIRES = parseInt(process.env.JWT_ONE_DAY_EXPIRES); // tiempo para renovación automática

async function validToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return handleError(res, "UNAUTHORIZED", STATUS.ERROR.UNAUTHORIZED);

    const token = authHeader.split(" ")[1];
    const decoded = await verifyToken(token);

    if (!decoded) return handleError(res, "INVALID_TOKEN", STATUS.ERROR.UNAUTHORIZED);

    // Key en Redis por usuario
    const redisKey = `user:${decoded.user_id}`;
    const storedToken = await redisClient.get(redisKey);

    if (!storedToken || storedToken !== token) return handleError(res, "INVALID_TOKEN", STATUS.ERROR.UNAUTHORIZED);

    // Obtenemos TTL real del token en Redis
    const ttl = await redisClient.ttl(redisKey);

    // Renovar token si TTL restante < tiempo de renovación
    if (ttl < JWT_ONE_DAY_EXPIRES) {
      const newToken = await generateToken(decoded.user_id, decoded.role);
      res.setHeader("x-new-token", newToken); // enviamos al front
    }

    // Guardamos info del usuario
    req.user = { user_id: decoded.user_id, role: decoded.role };

    next();
  } catch (err) {
    return handleError(res, "INTERNAL", STATUS.ERROR.INTERNAL, err);
  }
}

module.exports = { validToken };
