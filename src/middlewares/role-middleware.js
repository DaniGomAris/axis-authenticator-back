function authorizedRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ 
        success: false, 
        message: "Usuario no autenticado o sin rol definido" 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: "No autorizado para esta ruta" 
      });
    }

    next();
  };
}

module.exports = { authorizedRoles };
