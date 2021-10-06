function guestMiddleware(req, res, next) {
  // si hay alguien logueado
  if (req.session.userLogged) {
    // redirigir al profile
    return res.redirect("/users/profile");
  }
  next();
}

module.exports = guestMiddleware;
