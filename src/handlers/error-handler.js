function handleError(res, err) {
  const ERROR_MAP = {
    // Auth errors
    "MISSING CREDENTIALS": { msg: "Faltan credenciales", status: 400 },
    "WRONG EMAIL": { msg: "Correo electrónico incorrecto", status: 400 },
    "WRONG PASSWORD": { msg: "Contraseña incorrecta", status: 401 },

    // Token
    "UNAUTHORIZED": { msg: "No autorizado", status: 403 },
    "INVALID TOKEN": { msg: "Token inválido o expirado", status: 401 },
    "TOKEN REQUIRED": { msg: "Se requiere token", status: 401 },

    // Permission errors
    "ACCESS DENIED": { msg: "Acceso denegado", status: 403 },

    // Not found
    "USER NOT FOUND": { msg: "Usuario no encontrado", status: 404 },

    // Password errors
    "PASSWORD AND RE-PASSWORD REQUIRED": { msg: "Se requieren contraseña y repetir contraseña", status: 400 },
    "PASSWORDS DO NOT MATCH": { msg: "Las contraseñas no coinciden", status: 400 },
    "NEW PASSWORD MUST BE DIFFERENT FROM CURRENT": { msg: "La nueva contraseña debe ser diferente a la actual", status: 400 },
    "OTP VERIFICATION REQUIRED": { msg: "Se requiere verificación por OTP", status: 400 },

    // QR
    "QR GENERATION FAILED": { msg: "Error al generar el código QR", status: 404 },
    "QR NOT FOUND": { msg: "Código QR no encontrado o expirado", status: 404 },
    "QR VALIDATION FAILED": { msg: "Error al validar el código QR", status: 404 },
    "QR ALREADY ACTIVE": { msg: "El código QR ya está activo, espere a que expire", status: 409 },

    // Twilio
    "OTP SEND FAILED": { msg: "Error al enviar el OTP", status: 500 },
    "OTP REQUIRED": { msg: "Se requiere OTP", status: 400 },
    "OTP EXPIRED": { msg: "OTP expirado o inválido", status: 400 },
    "OTP INCORRECT": { msg: "OTP incorrecto", status: 400 },

    // User
    "WRONG PASSWORD FORMAT": { msg: "Formato incorrecto 1may, 1min, car especial, 1num ", status: 401 },
  };

  const { msg, status } =
    ERROR_MAP[err.message?.toUpperCase?.()] || {
      msg: "Error interno del servidor",
      status: 500
    };

  return res.status(status).json({ message: msg });
}

module.exports = { handleError };
