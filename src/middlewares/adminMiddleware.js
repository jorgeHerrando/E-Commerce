function adminMiddleware(req, res, next) {
  res.locals.admin = false;
  if (req.session.userLogged) {
    if (req.session.userLogged.category != "admin") {
      return res.redirect("/users/login");
    } else {
      res.locals.admin = true;
    }
  } else {
    return res.redirect("/users/login");
  }
  next();
}

module.exports = adminMiddleware;
