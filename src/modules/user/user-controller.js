const UserService = require("@modules/user/user-service");
const { handleError } = require("@handlers/error-handler");

class UserController {

  // Get user info
  static async getUserInfoController(req, res) {
    try {
      const { userId } = req.params;
      const userInfo = await UserService.getUserInfoService(userId);

      res.status(200).json({
        success: true,
        user: userInfo
      });
    } catch (err) {
      handleError(res, err);
    }
  }

  // Change password via OTP
  static async changePasswordWithOtpController(req, res) {
    try {
      const { phone, password, rePassword } = req.body;

      await UserService.changeUserPasswordService(phone, password, rePassword);

      res.status(200).json({
        success: true,
        message: "Contraseña actualizada correctamente"
      });
    } catch (err) {
      handleError(res, err);
    }
  }
}

module.exports = UserController;
