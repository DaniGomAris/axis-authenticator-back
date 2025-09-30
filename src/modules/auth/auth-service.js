const User = require("@modules/auth/models/user-model");
const JwtStrategy = require("@modules/auth/strategies/jwt-strategy");
const logger = require("@utils/logger");
const { validateLogin, validatePassword, validateRole } = require("@modules/auth/validators/auth-validator");
const argon2 = require("argon2");

class AuthService {

  // Login user
  static async loginUserService(email, password) {
    validateLogin(email, password);

    const user = await User.findOne({ email }).populate("companies", "-__v");
    if (!user) {
      logger.error(`User not found with email: ${email}`);
      throw new Error("USER NOT FOUND");
    }

    await validatePassword(user.password, password);
    validateRole(user.role, ["admin", "user"]);

    const { password: _, ...userWithoutPassword } = user.toObject();
    const token = await JwtStrategy.generateTokenStrategy(user._id, user.role);

    return { user: userWithoutPassword, token };
  }

  // Logout user
  static async logoutUserService(token) {
    if (!token) {
      logger.error("Logout failed: token required");
      throw new Error("TOKEN REQUIRED");
    }

    const decoded = await JwtStrategy.verifyTokenStrategy(token);
    if (!decoded) {
      logger.error("Logout failed: invalid token");
      throw new Error("INVALID TOKEN");
    }

    await JwtStrategy.invalidateTokenStrategy(decoded.user_id);
    return true;
  }

  // Verify token
  static async verifyUserTokenService(token) {
    if (!token) {
      logger.warn("Token verification failed: no token provided");
      throw new Error("TOKEN REQUIRED");
    }

    const decoded = await JwtStrategy.verifyTokenStrategy(token);
    if (!decoded) {
      logger.warn("Token verification failed: invalid token");
      throw new Error("INVALID TOKEN");
    }

    const user = await User.findById(decoded.user_id).populate("companies", "-__v");
    if (!user) throw new Error("USER NOT FOUND");

    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  // Get user data
  static async getUserInfoService(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("USER NOT FOUND");

    return {
      fullName: `${user.name} ${user.last_name1} ${user.last_name2 || ""}`.trim(),
      role: user.role
    };
  }

  // Change password
  static async changeUserPasswordService(userId, password, rePassword) {
    if (!password || !rePassword) {
      throw new Error("PASSWORD AND RE-PASSWORD REQUIRED");
    }

    if (password !== rePassword) {
      throw new Error("PASSWORDS DO NOT MATCH");
    }

    const user = await User.findById(userId);
    if (!user) throw new Error("USER NOT FOUND");

    const hashedPassword = await argon2.hash(password);
    user.password = hashedPassword;
    await user.save();

    return true;
  }
}

module.exports = AuthService;
