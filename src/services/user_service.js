const User = require("../models/user_model");
const argon2 = require("argon2");
const STATUS = require("../constants/status_constants");

const { validateLogin } = require("../validators/user_validator");
const { handleError } = require("../handlers/error_handler");
const { handleValidation } = require("../handlers/validate_handler");
const { generateToken, generateRefreshToken, storeRefreshToken } = require("../auth/jwt_auth");

async function loginUser(email, password, res) {
  try {
    // Validaciones iniciales
    validateLogin(email, password);

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return handleError(res, "USER_NOT_FOUND", STATUS.ERROR.NOT_FOUND);
    }

    // Validar contraseña
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return handleError(res, "INVALID_CREDENTIALS", STATUS.ERROR.UNAUTHORIZED);
    }

    // Validar roles permitidos
    if (!["user", "admin"].includes(user.role)) {
      return handleError(res, "INAUTHORIZED", STATUS.ERROR.FORBIDDEN);
    }

    // Quitar contraseña del objeto de usuario
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Generar tokens
    const token = generateToken(user._id, user.role, user.company_id);
    const refreshToken = generateRefreshToken(user._id, user.role, user.company_id);

    // TTL coherente con JWT_REFRESH_EXPIRES
    const ttlSeconds = parseInt(process.env.JWT_REFRESH_EXPIRES) / 1000;
    await storeRefreshToken(refreshToken, user._id, ttlSeconds);

    // Respuesta exitosa
    return res.status(STATUS.SUCCESS.OK).json({
      success: true,
      status: STATUS.SUCCESS.OK,
      message: handleValidation("LOGIN_SUCCESS"),
      user: userWithoutPassword,
      token,
      refreshToken,
    });

  } catch (err) {
    // Errores de validación
    if (err.message.includes("Email")) {
      return handleError(res, "INVALID_EMAIL", STATUS.ERROR.BAD_REQUEST);
    }
    if (err.message.includes("Password")) {
      return handleError(res, "INVALID_PASSWORD", STATUS.ERROR.BAD_REQUEST);
    }

    return handleError(res, "INTERNAL", STATUS.ERROR.INTERNAL, err);
  }
}

module.exports = { loginUser };
