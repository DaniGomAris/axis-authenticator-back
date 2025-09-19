const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis-config");

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const JWT_ACCESS_EXPIRES = parseInt(process.env.JWT_ACCESS_EXPIRES);

// Generate a token and save in Redis
async function generateToken(user_id, role) {
  const token = jwt.sign(
    { user_id, role }, 
    JWT_SECRET, 
    {
    expiresIn: JWT_ACCESS_EXPIRES,
    algorithm: "HS256", // HMAC SHA256
  });

  const redisKey = `user:${user_id}`;

  // Remove any existing token for this user
  await redisClient.del(redisKey);

  // Store the new token in Redis with a TTL
  await redisClient.setEx(redisKey, JWT_ACCESS_EXPIRES, token);

  return token;
}


// very token and if exists in Redis
async function verifyToken(token) {
  try {
    // Decode and verify JWT signature
    const decoded = jwt.verify(token, JWT_SECRET);

    const redisKey = `user:${decoded.user_id}`;
    const storedToken = await redisClient.get(redisKey);

    // Check if the token exists in Redis and matches
    if (!storedToken || storedToken !== token) return null;

    return { user_id: decoded.user_id, role: decoded.role, exp: decoded.exp };
  } catch (err) {

    // Token is invalid or expired
    return null;
  }
}

// Elimina token de Redis (logout)
async function invalidateToken(user_id) {
  const redisKey = `user:${user_id}`;

  // Remove any existing token for this user
  await redisClient.del(redisKey);
}

module.exports = {
  generateToken,
  verifyToken,
  invalidateToken,
};

