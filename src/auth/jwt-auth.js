const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis-config");

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const JWT_ACCESS_EXPIRES = parseInt(process.env.JWT_ACCESS_EXPIRES); // e.g., 120 segundos

// Genera un token y lo guarda en Redis (un solo token por usuario)
async function generateToken(user_id, role) {
  const token = jwt.sign({ user_id, role }, JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES,
    algorithm: "HS256",
  });

  const redisKey = `user:${user_id}`;

  // Invalidar token anterior si existe
  await redisClient.del(redisKey);

  // Guardar el nuevo token con TTL
  await redisClient.setEx(redisKey, JWT_ACCESS_EXPIRES, token);

  return token;
}

// Verifica el token (firma + existencia en Redis)
async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const redisKey = `user:${decoded.user_id}`;
    const storedToken = await redisClient.get(redisKey);

    if (!storedToken || storedToken !== token) return null;

    return { user_id: decoded.user_id, role: decoded.role, exp: decoded.exp };
  } catch (err) {
    return null;
  }
}

// Elimina token de Redis (logout)
async function invalidateToken(user_id) {
  const redisKey = `user:${user_id}`;
  await redisClient.del(redisKey);
}

module.exports = {
  generateToken,
  verifyToken,
  invalidateToken,
};

