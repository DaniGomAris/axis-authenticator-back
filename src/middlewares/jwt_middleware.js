const { verifyToken } = require("../auth/jwt_auth");
const { handleError } = require("../handlers/error_handler");
const STATUS = require("../constants/status_constants");

function authenticateRequest(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return handleError(res, "INAUTHORIZED", STATUS.ERROR.UNAUTHORIZED);
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return handleError(res, "INVALID_CREDENTIALS", STATUS.ERROR.UNAUTHORIZED);
  }

  if (decoded?.expired) {
    return handleError(res, "TOKEN_EXPIRED", STATUS.ERROR.UNAUTHORIZED);
  }

  req.user = decoded;
  next();
}

module.exports = { authenticateRequest };
