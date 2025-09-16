const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES = process.env.JWT_ACCESS_EXPIRES;
const JWT_TEMPORAL_EXPIRES = process.env.JWT_TEMPORAL_ACCESS_EXPIRES;


// Genera un JWT principal con user_id y role
function generateToken(user_id, role) {
  return jwt.sign(
    { user_id, role },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES, 
      algorithm: "HS256",
    }
  );
}

// Valida un JWT
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    return {
      user_id: decoded.user_id,
      role: decoded.role,
      exp: decoded.exp
    };
  } catch (err) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken
};
