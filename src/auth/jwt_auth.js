const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis_config");
const logger = require("../logger/logger");

// legacy single secret (backwards compat)
const LEGACY_SECRET = process.env.JWT_SECRET_KEY;

// rotation keys
const JWT_SECRET_CURRENT = process.env.JWT_SECRET_CURRENT;
const JWT_SECRET_PREVIOUS = process.env.JWT_SECRET_PREVIOUS;
const KID_CURRENT = process.env.JWT_KID_CURRENT || "current";
const KID_PREVIOUS = process.env.JWT_KID_PREVIOUS || "previous";

// expirations
const JWT_EXPIRES = process.env.JWT_ACCESS_EXPIRES;            
const JWT_TEMPORAL_EXPIRES = process.env.JWT_TEMPORAL_ACCESS_EXPIRES; 
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";

// 👉 convertir expiración a segundos (para Redis TTL)
function parseExpiryToSeconds(exp) {
  if (/^\d+$/.test(exp)) {
    // número puro → segundos
    return parseInt(exp, 10);
  }

  const match = /^(\d+)([smhd])$/.exec(exp);
  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s": return value;
    case "m": return value * 60;
    case "h": return value * 60 * 60;
    case "d": return value * 60 * 60 * 24;
    default: return null;
  }
}

const REFRESH_TTL_SECONDS = parseExpiryToSeconds(JWT_REFRESH_EXPIRES);

function getSigningKeyAndKid() {
  if (JWT_SECRET_CURRENT) {
    return { key: JWT_SECRET_CURRENT, kid: KID_CURRENT };
  }
  if (LEGACY_SECRET) {
    return { key: LEGACY_SECRET, kid: null };
  }
  throw new Error("No JWT signing key configured in env");
}

// Access token corto
function generateToken(user_id, role) {
  const { key, kid } = getSigningKeyAndKid();

  const signOptions = {
    subject: user_id,
    expiresIn: JWT_EXPIRES,
    algorithm: "HS256",
  };

  const signHeader = kid ? { header: { kid } } : {};

  return jwt.sign(
    { role },
    key,
    { ...signOptions, ...(signHeader.header ? { header: signHeader.header } : {}) }
  );
}

// JWT temporal
function generateTemporaryToken(user_id, company_id) {
  const { key, kid } = getSigningKeyAndKid();

  const signOptions = {
    subject: user_id,
    expiresIn: JWT_TEMPORAL_EXPIRES,
    algorithm: "HS256",
  };

  const signHeader = kid ? { header: { kid } } : {};

  return jwt.sign(
    { company_id },
    key,
    { ...signOptions, ...(signHeader.header ? { header: signHeader.header } : {}) }
  );
}

// Refresh token
function generateRefreshToken(user_id) {
  const { key, kid } = getSigningKeyAndKid();

  const signOptions = {
    subject: user_id,
    expiresIn: JWT_REFRESH_EXPIRES,
    algorithm: "HS256",
  };

  const signHeader = kid ? { header: { kid } } : {};

  return jwt.sign(
    { type: "refresh" },
    key,
    { ...signOptions, ...(signHeader.header ? { header: signHeader.header } : {}) }
  );
}

function secretForKid(kid) {
  if (!kid) {
    return LEGACY_SECRET || JWT_SECRET_CURRENT || JWT_SECRET_PREVIOUS || null;
  }

  if (kid === KID_CURRENT && JWT_SECRET_CURRENT) return JWT_SECRET_CURRENT;
  if (kid === KID_PREVIOUS && JWT_SECRET_PREVIOUS) return JWT_SECRET_PREVIOUS;

  return LEGACY_SECRET || null;
}

function verifyToken(token) {
  try {
    const decodedHeader = jwt.decode(token, { complete: true });
    const kid = decodedHeader?.header?.kid || null;

    const secret = secretForKid(kid);
    if (!secret) {
      logger.error(`JWT verification failed: no secret found for kid=${kid}`);
      return null;
    }

    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    });

    return {
      user_id: decoded.sub,
      role: decoded.role || null,
      company_id: decoded.company_id || null,
      type: decoded.type || "access",
      exp: decoded.exp,
      iat: decoded.iat,
    };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      logger.warn("JWT expired");
      return { expired: true };
    }
    logger.error(`JWT verification error: ${err.message}`);
    return null;
  }
}

// Guarda un refresh token en Redis con TTL sincronizado
async function storeRefreshToken(refreshToken, user_id) {
  try {
    await redisClient.setEx(`refresh:${refreshToken}`, REFRESH_TTL_SECONDS, user_id);
  } catch (err) {
    logger.error(`Error storing refresh token: ${err.message}`);
  }
}

// Verifica si el refresh token sigue valido
async function verifyRefreshToken(refreshToken) {
  try {
    return await redisClient.get(`refresh:${refreshToken}`);
  } catch (err) {
    logger.error(`Error verifying refresh token: ${err.message}`);
    return null;
  }
}

// Revoca refresh token (logout)
async function revokeRefreshToken(refreshToken) {
  try {
    await redisClient.del(`refresh:${refreshToken}`);
  } catch (err) {
    logger.error(`Error revoking refresh token: ${err.message}`);
  }
}

module.exports = {
  generateToken,
  generateTemporaryToken,
  generateRefreshToken,
  verifyToken,
  storeRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
};
