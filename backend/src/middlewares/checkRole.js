const checkRole = (role) => (req, res, next) => {
  if (!req.userRoles.includes(role)) {
    return res
      .status(403)
      .json({ error: "Acceso denegado. No tienes permisos." });
  }
  next();
};

export default checkRole;
