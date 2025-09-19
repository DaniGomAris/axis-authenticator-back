module.exports = { handleError };

function handleError(res, err) {
  const ERROR_MAP = {
    // Auth errors
    "MISSING CREDENTIALS": { msg: "Missing credentials", status: 400 },
    "WRONG EMAIL": { msg: "Wrong email", status: 400 },
    "WRONG PASSWORD": { msg: "Wrong password", status: 401 },

    // Token
    "UNAUTHORIZED": { msg: "Unauthorized", status: 403 },
    "INVALID TOKEN": { msg: "Invalid or expired token", status: 401 },
    "TOKEN REQUIRED": { msg: "Token required", status: 401 },

    // Permission errors
    "ACCESS DENIED": { msg: "Access denied", status: 403 },

    // Not found
    "USER NOT FOUND": { msg: "User not found", status: 404 },

    // QR
    "QR GENERATION FAILED": { msg: "Failed to generate QR", status: 404 },
    "QR NOT FOUND": { msg: "QR not found or expired", status: 404 },
    "QR VALIDATION FAILED": { msg: "Failed to validate QR", status: 404 },
  };

  const { msg, status } = ERROR_MAP[err.message?.toUpperCase?.()] || { msg: "Internal server error", status: 500 };
  return res.status(status).json({ message: msg });
}

module.exports = { handleError };
