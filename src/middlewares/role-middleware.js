const { handleError } = require("../handlers/error-handler");

function authorizedRoles(roles = []) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        const err = new Error("UNAUTHORIZED");
        return handleError(res, err);
      }

      if (!roles.includes(req.user.role)) {
        const err = new Error("ACCESS DENIED");
        return handleError(res, err);
      }

      next();
    } catch (err) {
      handleError(res, err)
    }
  };
}

module.exports = { authorizedRoles };
