function userLoggedMiddleware(req, res, next) {
  res.locals.isLogged = false;

  // si hay alguien logueado..
  if (req.session.userLogged) {
    res.locals.isLogged = true;
    res.locals.userLogged = req.session.userLogged; //paso lo que tengo en session a una variable local
  }

  next();
}
// pasamos a un middleware de aplicacion para saber si esta en true o false, y asi mostrar distintas cosas
module.exports = userLoggedMiddleware;
