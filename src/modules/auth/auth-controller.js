const { loginUser, logoutUser } = require("./auth-service");
const { handleError } = require("../../handlers/error-handler");
const { handleValidation } = require("../../handlers/validate-handler");
const { verifyToken, invalidateToken } = require("../../auth/jwt-auth");
const STATUS = require("../../constants/status-constants");

// Iniciar sesion
async function loginUserController(req, res) {
  const { email, password } = req.body;

  try {
    const { user, token } = await loginUser(email, password);

    return res.status(STATUS.SUCCESS.OK).json({
      success: true,
      status: STATUS.SUCCESS.OK,
      message: handleValidation("LOGIN_SUCCESS"),
      user,
      token,
    });
  } catch (err) {
    switch (err.message) {
      case "USER_NOT_FOUND":
        return handleError(res, "USER_NOT_FOUND", STATUS.ERROR.NOT_FOUND);
      case "INVALID_CREDENTIALS":
        return handleError(res, "INVALID_CREDENTIALS", STATUS.ERROR.UNAUTHORIZED);
      case "UNAUTHORIZED":
        return handleError(res, "UNAUTHORIZED", STATUS.ERROR.FORBIDDEN);
      default:
        if (err.message.includes("Email")) return handleError(res, "INVALID_EMAIL", STATUS.ERROR.BAD_REQUEST);
        if (err.message.includes("Password")) return handleError(res, "INVALID_PASSWORD", STATUS.ERROR.BAD_REQUEST);
        return handleError(res, "INTERNAL", STATUS.ERROR.INTERNAL, err);
    }
  }
}

// Logout
async function logoutUserController(req, res) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return handleError(res, "UNAUTHORIZED", STATUS.ERROR.UNAUTHORIZED);
  }

  const token = authHeader.split(" ")[1];

  // Decodificar el token para usat el user_id
  const decoded = await verifyToken(token);
  if (!decoded) return handleError(res, "INVALID_TOKEN", STATUS.ERROR.UNAUTHORIZED);

  try {
    await invalidateToken(decoded.user_id);
    return res.status(STATUS.SUCCESS.OK).json({
      success: true,
      status: STATUS.SUCCESS.OK,
      message: "Logout successful",
    });
  } catch (err) {
    return handleError(res, "INTERNAL", STATUS.ERROR.INTERNAL, err);
  }
}

module.exports = { loginUserController, logoutUserController};
