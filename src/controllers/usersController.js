const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

// traemos modelo con métodos
const User = require("../models/User");

const usersController = {
  login: (req, res) => {
    res.render("users/login");
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
      ...req.body,
      image: req.file ? req.file.filename : "defaultAvatar.png",
      password: bcrypt.hashSync(req.body.password, 10),
    };
    // crear nuevo usuario con la info recopilada
    let userCreated = User.create(userToCreate);

    return res.redirect("/users/login");
  },
  processLogin: (req, res) => {
    // if(!users) {
    //   users = [];
    // }
    for (let i = 0; i < users.length; i++) {
      if (
        users[i].email == req.body.email &&
        bcrypt.compareSync(req.body.password, users[i].password)
      ) {
        res.render("adminIndex");
      }
    }
    res.render("users/login", { title: "Havenboards - Log In" });
  },
  // admin: (req, res) => {
  //   res.render("users/userAdmin", { title: "Admin - Sign Up" });
  // },
};
module.exports = usersController;
