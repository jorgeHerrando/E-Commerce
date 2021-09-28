const fs = require("fs");
const path = require("path");

const { validationResult, body } = require("express-validator");
const bcrypt = require("bcryptjs");

// traemos modelo con métodos
const User = require("../models/User");

const usersController = {
  login: (req, res) => {
    res.render("users/login");
  },

  processLogin: (req, res) => {
    const resultValidation = validationResult(req);

    // validaciones express
    if (resultValidation.errors.length > 0) {
      return res.render("users/login", {
        errors: resultValidation.mapped(), //convierto el array errors en obj.literal
        oldData: req.body,
      });
    }

    // existe el user?
    let userToLogin = User.findByField("email", req.body.email);

    if (userToLogin) {
      // el password coincide?
      let validPassword = bcrypt.compareSync(
        req.body.password,
        userToLogin.password
      );
      if (validPassword) {
        delete userToLogin.password;
        // se crea obj.literal session con prop userLogged y valor userToLogin
        req.session.userLogged = userToLogin;

        // creamos cookie
        if (req.body.remember) {
          res.cookie("userEmail", req.body.email, {
            maxAge: 1000 * 60 * 60 * 24, //24 horas
          });
        }
        return res.redirect("/users/profile");
      }
      // si contraseña inválida
      return res.render("users/login", {
        errors: {
          email: {
            msg: "Las credenciales no son inválidas",
          },
        },
        oldData: req.body,
      });
    }

    // si no se encuentra el email
    return res.render("users/login", {
      errors: {
        email: {
          msg: "Usuario no registrado",
        },
      },
      oldData: req.body,
    });
  },

  register: (req, res) => {
    res.render("users/register");
  },

  createUser: (req, res) => {
    const resultValidation = validationResult(req);

    if (resultValidation.errors.length > 0) {
      return res.render("users/register", {
        errors: resultValidation.mapped(), //convierto el array errors en obj.literal
        oldData: req.body,
      });
    }

    // Validación propia
    let userInDB = User.findByField("email", req.body.email);

    if (userInDB) {
      return res.render("users/register", {
        errors: {
          email: {
            msg: "Este email ya está registrado",
          },
        }, //convierto el array errors en obj.literal
        oldData: req.body,
      });
    }

    let userToCreate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      category: "user",
      image: req.file ? req.file.filename : "defaultAvatar.png",
    };
    // crear nuevo usuario con la info recopilada
    let userCreated = User.create(userToCreate);

    return res.redirect("/users/login");
  },

  profile: (req, res) => {
    res.render("users/profile", {
      user: req.session.userLogged,
    });
  },

  logout: (req, res) => {
    req.session.destroy();
    res.clearCookie("userEmail"); //destruye lo que hay en session y cookies
    return res.redirect("/");
  },

  delete: (req, res) => {
    res.render("users/userDelete", {
      user: req.session.userLogged,
    });
  },

  destroy: (req, res) => {
    User.delete(req.session.userLogged.id);
    res.redirect("/");
  },

  // admin: (req, res) => {
  //   res.render("users/userAdmin", { title: "Admin - Sign Up" });
  // },
};
module.exports = usersController;
