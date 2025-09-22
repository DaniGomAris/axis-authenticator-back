const User = require("@modules/auth/models/user-model");
const { validateLogin, validatePassword, validateRole } = require("@modules/auth/validators/auth-validator");
const { verifyToken, invalidateToken, generateToken } = require("@modules/auth/strategies/jwt-strategy");
const logger = require("@utils/logger");

// Login user
async function loginUser(email, password) {
  validateLogin(email, password);

  const user = await User.findOne({ email });
  if (!user) {
    logger.error(`User not found with email: ${email}`);
    throw new Error("USER NOT FOUND");
  }

  await validatePassword(user.password, password);

  validateRole(user.role, ["admin", "user"]);

  const { password: _, ...userWithoutPassword } = user.toObject();

  const token = await generateToken(user._id, user.role);

  logger.info(`Login successful for user ${user._id}`);
  return { user: userWithoutPassword, token };
}


// Logout user
async function logoutUser(token) {
  if (!token) {
    logger.error("Logout failed: token required");
    throw new Error("TOKEN REQUIRED");
  }

  const decoded = await verifyToken(token);
  if (!decoded) {
    logger.error("Logout failed: invalid token");
    throw new Error("INVALID TOKEN");
  }

  await invalidateToken(decoded.user_id);
  logger.info(`Logout successful for user ${decoded.user_id}`);
  return true;
}


// Verify a token is valid
async function verifyUserToken(token) {
  if (!token) {
    logger.warn("Token verification failed: no token provided");
    throw new Error("TOKEN REQUIRED");
  }

  const decoded = await verifyToken(token);
  if (!decoded) {
    logger.warn("Token verification failed: invalid token");
    throw new Error("INVALID TOKEN");
  }

  logger.info(`Token verified successfully for user:${decoded.user_id}`);
  return { user_id: decoded.user_id, role: decoded.role };
}

module.exports = { loginUser, logoutUser, verifyUserToken };
