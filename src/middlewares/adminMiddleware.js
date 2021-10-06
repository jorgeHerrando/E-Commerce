function adminMiddleware(req, res, next) {
  // lo reseteamos
  res.locals.admin = false;
  // si hay alguien logueado
  if (req.session.userLogged) {
    // y tiene categoría admin
    if (req.session.userLogged.role.role == "admin") {
      // creamos un local admin
      res.locals.admin = true;
      // si no, le redireccionamos
    } else {
      return res.redirect("/users/login");
    }
    // si no hay nadie logueado redirect
  } else {
    return res.redirect("/users/login");
  }
  next();
}

module.exports = adminMiddleware;
