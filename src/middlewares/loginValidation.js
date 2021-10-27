const { body } = require("express-validator");

const validations = [
  body("email")
    .notEmpty()
    .withMessage("Tienes que escribir un email")
    .bail()
    .isEmail()
    // .normalizeEmail({ gmail_remove_dots: false })
    .withMessage("Tiene que tener formato de email"),

  body("password").notEmpty().withMessage("Tienes que escribir un password"),
  // .bail()
  // .isLength({ min: 8, max: 20 })
  // .withMessage(
  //   "La contraseña debe tener al menos 8 dígitos, incluir una mayúscula, una minúscula, un número y un carácter especial('#?!@$%^&*-')"
  // )
  // .matches("[0-9]")
  // .withMessage(
  //   "La contraseña debe tener al menos 8 dígitos, incluir una mayúscula, una minúscula, un número y un carácter especial('#?!@$%^&*-')"
  // )
  // .matches("[A-Z]")
  // .withMessage(
  //   "La contraseña debe tener al menos 8 dígitos, incluir una mayúscula, una minúscula, un número y un carácter especial('#?!@$%^&*-')"
  // )
  // .matches("[#?!@$%^&*-]")
  // .withMessage(
  //   "La contraseña debe tener al menos 8 dígitos, incluir una mayúscula, una minúscula, un número y un carácter especial('#?!@$%^&*-')"
  // ),
];

module.exports = validations;
