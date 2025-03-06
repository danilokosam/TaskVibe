const checkRole = (role) => (req, res, next) => {
  if (req.user && req.user[`${process.env.AUDIENCE}/roles`].includes(role)) {
    next();
  } else {
    res.status(403).json({ error: "Acceso denegado" });
  }
};

export default checkRole;
