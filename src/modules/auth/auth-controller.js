const AuthService = require("@modules/auth/auth-service");
const { handleError } = require("@handlers/error-handler");

class AuthController {

  // Login user
  static async loginUserController(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.loginUserService(email, password);

      res.status(200).json({
        success: true,
        status: "ok",
        message: "Login exitoso",
        user,
        token
      });
    } catch (err) {
      handleError(res, err);
    }
  }

  // Logout user
  static async logoutUserController(req, res) {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) throw new Error("UNAUTHORIZED");

      const token = authHeader.split(" ")[1];
      if (!token) throw new Error("TOKEN REQUIRED");

      await AuthService.logoutUserService(token);

      res.status(200).json({
        success: true,
        status: "ok",
        message: "Logout exitoso"
      });
    } catch (err) {
      handleError(res, err);
    }
  }

  // Verify token
  static async verifyTokenController(req, res) {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) throw new Error("TOKEN REQUIRED");

      const token = authHeader.split(" ")[1];
      if (!token) throw new Error("TOKEN REQUIRED");

      const user = await AuthService.verifyUserTokenService(token);

      res.status(200).json({
        success: true,
        valid: true,
        user
      });
    } catch (err) {
      handleError(res, err, 401);
    }
  }
}

module.exports = AuthController;
