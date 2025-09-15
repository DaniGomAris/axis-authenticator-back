const User = require("./models/user-model");
const argon2 = require("argon2");
const STATUS = require("../../constants/status-constants");

const { validateLogin } = require("./validators/auth-validator");
const { handleError } = require("../../handlers/error-handler");
const { handleValidation } = require("../../handlers/validate-handler");
const { generateToken } = require("../../auth/jwt-auth");

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
      return handleError(res, "UNAUTHORIZED", STATUS.ERROR.FORBIDDEN);
    }

    // Quitar contraseña del objeto de usuario
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Generar JWT
    const token = generateToken(user._id, user.role);

    // Respuesta exitosa
    return res.status(STATUS.SUCCESS.OK).json({
      success: true,
      status: STATUS.SUCCESS.OK,
      message: handleValidation("LOGIN_SUCCESS"),
      user: userWithoutPassword,
      token,
    });

  } catch (err) {
    // Errores de validacion
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
