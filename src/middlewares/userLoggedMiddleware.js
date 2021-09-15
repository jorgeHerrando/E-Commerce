const User = require("../models/User");

function userLoggedMiddleware(req, res, next) {
  res.locals.isLogged = false;

  let emailInCookie = req.cookies.userEmail; //guardo en variable lo que hay en la cookie userEmail
  let userFromCookie = User.findByField("email", emailInCookie);

  // si hay cookies de email
  if (userFromCookie) {
    req.session.userLogged = userFromCookie;
  }

  // si hay alguien logueado(controlador), o hay cookies..
  if (req.session.userLogged) {
    res.locals.isLogged = true;
    res.locals.userLogged = req.session.userLogged; //paso lo que tengo en session a una variable local
  }

  next();
}
// pasamos a un middleware de aplicacion para saber si esta en true o false, y asi mostrar distintas cosas
module.exports = userLoggedMiddleware;
