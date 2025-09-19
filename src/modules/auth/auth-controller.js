const { loginUser, logoutUser } = require("./auth-service");
const { handleError } = require("../../handlers/error-handler");
const logger = require("../../utils/logger");

// Controller to login a user
async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);

    res.status(200).json({
      success: true,
      status: "ok",
      message: "Login exitoso",
      user,
      token
    });
    logger.info("Login exitoso");
  } catch (err) {
    handleError(res, err);
  }
}

// Controller to logout a user
async function logoutUserController(req, res) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      throw new Error("UNAUTHORIZED");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("TOKEN REQUIRED");
    }

    await logoutUser(token);

    res.status(200).json({
      success: true,
      status: "ok",
      message: "Logout exitoso"
    });
    logger.info("Logout exitoso");
  } catch (err) {
    handleError(res, err);
  }
}

module.exports = { loginUserController, logoutUserController };
