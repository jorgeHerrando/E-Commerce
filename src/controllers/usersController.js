const fs = require("fs");
const path = require("path");
const axios = require("axios");

const { validationResult, body } = require("express-validator");
const bcrypt = require("bcryptjs");

// // traemos modelo con métodos - JSON
// const User = require("../models/User");

// para trabajar con la DB
const db = require("../database/models");
// const { response } = require("express");
const Op = db.Sequelize.Op;

const usersController = {
  login: (req, res) => {
    res.render("users/login");
  },

  processLogin: async (req, res) => {
    const resultValidation = validationResult(req);

    // validaciones express
    if (resultValidation.errors.length > 0) {
      return res.render("users/login", {
        errors: resultValidation.mapped(), //convierto el array errors en obj.literal
        oldData: req.body,
      });
    }

    // // existe el user? - JSON
    // let userToLogin = User.findByField("email", req.body.email);

    // Validación propia: existe el user?
    let userToLogin = await db.User.findOne({
      include: ["image", "role", "address"],
      where: {
        email: req.body.email,
      },
    });

    // existe el user?
    if (userToLogin) {
      // el password coincide?
      let validPassword = bcrypt.compareSync(
        req.body.password,
        userToLogin.password
      );
      if (validPassword) {
        // para no almacenar el password en session
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
      } else {
        // si contraseña inválida
        return res.render("users/login", {
          errors: {
            email: {
              msg: "Las credenciales no son válidas",
            },
          },
          oldData: req.body,
        });
      }
      // si no se encuentra el user
    } else {
      // si no se encuentra el email
      return res.render("users/login", {
        errors: {
          email: {
            msg: "Usuario no registrado",
          },
        },
        oldData: req.body,
      });
    }
  },

  // form register
  register: (req, res) => {
    return res.render("users/register");
  },

  // envío register
  createUser: async (req, res) => {
    const resultValidation = validationResult(req);
    console.log(req);

    if (resultValidation.errors.length > 0) {
      return res.render("users/register", {
        errors: resultValidation.mapped(), //convierto el array errors en obj.literal
        oldData: req.body,
      });
    }

    // Validación propia, que no exista ya el email
    let userInDB = await db.User.findOne({
      where: {
        email: req.body.email,
      },
    });

    // si ya existe..
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

    // vemos si subió alguna imagen
    let avatar;
    // si la subió la creamos
    if (req.file) {
      avatar = await db.UserImage.create({
        name: req.file.filename,
      });
      // si no buscamos el default
    } else {
      avatar = await db.UserImage.findOne({
        where: {
          id: 1,
        },
      });
    }

    await db.User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      role_id: 1,
      image_id: avatar.id,
    });

    return res.redirect("/users/login");
  },

  // detalle usuario
  profile: (req, res) => {
    return res.render("users/profile", {
      user: req.session.userLogged,
    });
  },

  // orders
  order: async (req, res) => {
    // recoge el id por param
    let id = req.params.id;

    // todas las orders del user
    let orders = await db.Order.findAll({
      include: ["orderDetails", "user", "address", "paymentMethod"],
      where: {
        user_id: id,
      },
    });
    // todos los orderDetail del user
    let orderDetail = await db.OrderDetail.findAll({
      include: ["order", "product"],
      where: {
        user_id: id,
      },
    });
    return res.render("users/orders", {
      orders,
      orderDetail,
    });
  },

  // detalle usuario
  editProfile: (req, res) => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((countries) => {
        console.log(countries.data);
        return res.render("users/editProfile", {
          user: req.session.userLogged,
          countries: countries,
        });
      })
      .catch((error) => console.log(error));
  },

  processEditProfile: async (req, res) => {
    const resultValidation = validationResult(req);

    // validaciones express
    if (resultValidation.errors.length > 0) {
      return res.render("users/editProfile", {
        errors: resultValidation.mapped(), //convierto el array errors en obj.literal
        oldData: req.body,
        user: req.session.userLogged,
      });
    }

    let user = req.session.userLogged;

    // busco user a editar
    let userToUpdate = await db.User.findOne({
      include: ["image", "role", "address"],
      where: {
        id: user.id,
      },
    });

    // si modificaron nombre o apellido
    if (
      userToUpdate.firstName != req.body.firstName ||
      userToUpdate.lastName != req.body.lastName
    ) {
      // lo modificamos
      await db.User.update(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        },
        {
          where: {
            id: user.id,
          },
        }
      );
    }

    // IMAGE
    // si viene imagen
    if (req.file) {
      // creamos una
      let avatar = await db.UserImage.create({ name: req.file.filename });
      // y se la metemos al user
      await db.User.update(
        {
          image_id: avatar.id,
        },
        {
          where: {
            id: user.id,
          },
        }
      );
    }

    // guardamos los valores de address en la variable
    let address = [
      req.body.streetName,
      req.body.number,
      req.body.apartment,
      req.body.province,
      req.body.city,
      req.body.postalCode,
      req.body.country,
    ];
    let notEmptyAddress = [];
    for (let elem of address) {
      if (elem) {
        notEmptyAddress.push(elem);
        break;
      }
    }

    // si el user tiene address se actualiza el address
    if (userToUpdate.address) {
      await db.Address.update(
        {
          streetName: req.body.streetName,
          number: req.body.number ? Number(req.body.number) : null,
          apartment: req.body.apartment,
          province: req.body.province,
          city: req.body.city,
          postalCode: req.body.postalCode ? Number(req.body.postalCode) : null,
          country: req.body.country,
        },
        {
          where: {
            user_id: user.id,
          },
        }
      );
      // si no, se crea uno si hay algún dato
    } else if (notEmptyAddress.length > 0) {
      await userToUpdate.createAddress(
        {
          streetName: req.body.streetName,
          number: req.body.apartment ? Number(req.body.number) : null,
          apartment: req.body.apartment,
          province: req.body.province,
          city: req.body.city,
          postalCode: req.body.postalCode ? Number(req.body.postalCode) : null,
          country: req.body.country,
          user_id: user.id,
        },
        {}
      );
    }

    // buscamos el usuario editado
    const userEdited = await db.User.findOne({
      include: ["image", "role", "address"],
      where: {
        id: user.id,
      },
    });
    // lo pasamos a session
    req.session.userLogged = userEdited;

    res.redirect("/users/profile");
  },

  logout: function (req, res) {
    req.session.destroy();
    res.clearCookie("userEmail"); //destruye lo que hay en session y cookies
    return res.redirect("/");
  },

  delete: (req, res) => {
    res.render("users/userDelete", {
      user: req.session.userLogged,
    });
  },

  destroy: async function (req, res) {
    const id = req.session.userLogged.id;

    // primero eliminamos asociaciones
    const userToDelete = await db.User.findOne({
      include: ["address", "image"],
      where: {
        id: id,
      },
    });

    // Address
    if (userToDelete.address) {
      await db.Address.destroy({
        where: {
          user_id: id,
        },
      });
    }

    // Avatar borrar si no es la default
    if (userToDelete.image.id != 1) {
      await db.UserImage.destroy({
        where: {
          id: userToDelete.image.id,
        },
      });
    }

    // eliminamos user
    await db.User.destroy({
      where: {
        id: id,
      },
    });

    // si no se queda logueado
    return res.redirect("/users/logout");
  },

  // admin: (req, res) => {
  //   res.render("users/userAdmin", { title: "Admin - Sign Up" });
  // },
};
module.exports = usersController;
