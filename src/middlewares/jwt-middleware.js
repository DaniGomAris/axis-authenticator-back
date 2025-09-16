const { verifyToken } = require("../auth/jwt-auth");
const { handleError } = require("../handlers/error-handler");
const STATUS = require("../constants/messages-constants");

function validToken(req, res, next) {
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

  req.user = {
    user_id: decoded.user_id,
    role: decoded.role
  };
  next();
}

module.exports = { validToken };
