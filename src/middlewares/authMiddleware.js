function authMiddleware(req, res, next) {
  res.locals.admin = false;
  if (!req.session.userLogged) {
    return res.redirect("/users/login");
  }
  next();
}

module.exports = authMiddleware;
