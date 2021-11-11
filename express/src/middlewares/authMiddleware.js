function authMiddleware(req, res, next) {
  // reseteamos
  res.locals.admin = false;
  // si no hay nadie logueado
  if (!req.session.userLogged) {
    // retornar al login
    return res.redirect("/users/login");
  }
  next();
}

module.exports = authMiddleware;
