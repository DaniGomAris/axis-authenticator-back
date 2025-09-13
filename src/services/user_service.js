const User = require("../models/user_model");
const argon2 = require("argon2");
const STATUS = require("../constants/status_constants");

const { validateLogin } = require("../validators/user_validator");
const { handleError } = require("../handlers/error_handler");
const { handleValidation } = require("../handlers/validate_handler");
const { generateToken } = require("../auth/jwt_auth");

async function loginUser(email, password, res) {
  try {
    validateLogin(email, password);

    const user = await User.findOne({ email });
    if (!user) {
      return handleError(res, "USER_NOT_FOUND", STATUS.ERROR.NOT_FOUND);
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return handleError(res, "INVALID_CREDENTIALS", STATUS.ERROR.UNAUTHORIZED);
    }

    // Validacion de rol
    if (!["user", "admin"].includes(user.role)) {
      return handleError(res, "INAUTHORIZED", STATUS.ERROR.FORBIDDEN);
    }

    const { password: _, ...userWithoutPassword } = user.toObject();

    const token = generateToken(user._id, user.role);

    return res.status(STATUS.SUCCESS.OK).json({
      success: true,
      status: STATUS.SUCCESS.OK,
      message: handleValidation("LOGIN_SUCCESS"),
      user: userWithoutPassword,
      token,
    });
  } catch (err) {

    // Errores de validación
    if (err.message.includes("Email")) {
      return handleError(res, "INVALID_EMAIL", STATUS.ERROR.BAD_REQUEST);
    }
    if (err.message.includes("Password")) {
      return handleError(res, "INVALID_PASSWORD", STATUS.ERROR.BAD_REQUEST);
    }

    // Error inesperado
    console.error("Login error:", err);
    return handleError(res, "INTERNAL", STATUS.ERROR.INTERNAL);
  }
}

module.exports = { loginUser };
