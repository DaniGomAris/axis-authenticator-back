module.exports = {
  SUCCESS: {
    OK: 200,                      // Petición exitosa
    CREATED: 201,                 // Recurso creado
    ACCEPTED: 202,                // Aceptado pero no procesado aun
    NO_CONTENT: 204               // Petición exitosa sin contenido en la respuesta
  },

  REDIRECTION: {
    MOVED_PERMANENTLY: 301,       // Redirección permanente
    FOUND: 302,                   // Redirección temporal
    NOT_MODIFIED: 304             // Recurso no modificado (cache)
  },

  ERROR: {
    BAD_REQUEST: 400,             // Petición inválida
    UNAUTHORIZED: 401,            // No autenticado (falta token / credenciales)
    FORBIDDEN: 403,               // Autenticado pero sin permisos
    NOT_FOUND: 404,               // Recurso no encontrado
    METHOD_NOT_ALLOWED: 405,      // Método HTTP no permitido
    CONFLICT: 409,                // Conflicto con estado actual
    PAYLOAD_TOO_LARGE: 413,       // Body demasiado grande
    UNSUPPORTED_MEDIA_TYPE: 415,  // Tipo de contenido no soportado
    UNPROCESSABLE_ENTITY: 422,    // Datos validos pero no procesables
    TOO_MANY_REQUESTS: 429,       // Límite de peticiones alcanzado
    INTERNAL: 500,                // Error interno del servidor
    NOT_IMPLEMENTED: 501,         // Endpoint no implementado
    BAD_GATEWAY: 502,             // Error en gateway/proxy
    SERVICE_UNAVAILABLE: 503,     // Servicio no disponible
    GATEWAY_TIMEOUT: 504          // Tiempo de espera excedido
  }
};
