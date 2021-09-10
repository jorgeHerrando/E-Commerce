const { body } = require("express-validator");

const validations = [
  body("email")
    .notEmpty()
    .withMessage("Tienes que escribir un email")
    .bail()
    .isEmail()
    .normalizeEmail()
    .withMessage("Tiene que tener formato de email"),

  body("password")
    .notEmpty()
    .withMessage("Tienes que escribir un password")
    .bail()
    .isLength({ min: 6, max: 20 })
    .withMessage(
      "La contraseña debe tener al menos 6 dígitos, incluir una mayúscula, una minúscula, y un número"
    )
    .matches("[0-9]")
    .withMessage(
      "La contraseña debe tener al menos 6 dígitos, incluir una mayúscula, una minúscula, y un número"
    )
    .matches("[A-Z]")
    .withMessage(
      "La contraseña debe tener al menos 6 dígitos, incluir una mayúscula, una minúscula, y un número"
    ),
];

module.exports = validations;
