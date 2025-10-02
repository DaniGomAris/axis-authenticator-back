const User = require("@modules/auth/models/user-model");
const argon2 = require("argon2");
const redisClient = require("@config/redis-config");
const { validateUser } = require("@modules/user/validators/user-validator");

const TWILIO_VERIFIED_PREFIX = "otp-verified:";

class UserService {

  // Get user info
  static async getUserInfoService(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("USER NOT FOUND");

    return {
      fullName: `${user.name} ${user.last_name1} ${user.last_name2 || ""}`.trim(),
      role: user.role
    };
  }

  // Change password via OTP
  static async changeUserPasswordService(phone, password, rePassword) {
    if (!phone || !password || !rePassword) {
      throw new Error("PASSWORD AND RE-PASSWORD REQUIRED");
    }

    if (password !== rePassword) {
      throw new Error("PASSWORDS DO NOT MATCH");
    }

    validateUser({ password });

    // Check OTP verification
    const verified = await redisClient.get(`${TWILIO_VERIFIED_PREFIX}${phone}`);
    if (!verified) {
      throw new Error("OTP VERIFICATION REQUIRED");
    }

    const user = await User.findOne({ phone });
    if (!user) throw new Error("USER NOT FOUND");

    // Ensure new password is different
    const isSameAsCurrent = await argon2.verify(user.password, password);
    if (isSameAsCurrent) {
      throw new Error("NEW PASSWORD MUST BE DIFFERENT FROM CURRENT");
    }

    // Hash and save new password
    const hashedPassword = await argon2.hash(password);
    user.password = hashedPassword;
    await user.save();

    // Remove OTP verified flag
    await redisClient.del(`${TWILIO_VERIFIED_PREFIX}${phone}`);

    return true;
  }
}

module.exports = UserService;
