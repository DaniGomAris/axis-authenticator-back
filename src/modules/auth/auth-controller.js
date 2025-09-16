const { loginUser } = require("./auth-service");
const { handleError } = require("../../handlers/error-handler");
const { handleValidation } = require("../../handlers/validate-handler");
const STATUS = require("../../constants/status-constants");

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

module.exports = { loginUserController };
