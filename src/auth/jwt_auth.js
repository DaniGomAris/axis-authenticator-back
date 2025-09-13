const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES = process.env.JWT_ACCESS_EXPIRES;
const JWT_TEMPORAL_EXPIRES = process.env.JWT_TEMPORAL_ACCESS_EXPIRES;


// Genera un JWT principal con user_id y role
function generateToken(user_id, role) {
  return jwt.sign(
    { role },
    JWT_SECRET,
    { subject: user_id, expiresIn: JWT_EXPIRES }
  );
}

// Genera un JWT temporal
function generateTemporaryToken(user_id, company_id) {

  return jwt.sign(
    { company_id },
    JWT_SECRET,
    { subject: user_id, expiresIn: JWT_TEMPORAL_EXPIRES }
  );
}

// Valida un JWT
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    return {
      user_id: decoded.sub,
      role: decoded.role,
      company_id: decoded.company_id || null,
      exp: decoded.exp
    };
  } catch (err) {
    return null;
  }
}

module.exports = {
  generateToken,
  generateTemporaryToken,
  verifyToken
};
