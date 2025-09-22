const { loginUser, logoutUser, verifyUserToken } = require("@modules/auth/auth-service");
const { handleError } = require("@handlers/error-handler");
const logger = require("@utils/logger");

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

// Controller para verificar token
async function verifyTokenController(req, res) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) throw new Error("TOKEN REQUIRED");

    const token = authHeader.split(" ")[1];
    if (!token) throw new Error("TOKEN REQUIRED");

    const user = await verifyUserToken(token);

    res.status(200).json({
      success: true,
      valid: true,
      user
    });
  } catch (err) {
    handleError(res, err, 401);
  }
}

module.exports = { loginUserController, logoutUserController, verifyTokenController };
