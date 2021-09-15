const { body } = require("express-validator");

const passwordValidation = [
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

  body("password2").custom((value, { req }) => {
    let password = req.body.password;
    let password2 = req.body.password2;

    if (password !== password2) {
      throw new Error(`Las contraseñas deben coincidir`);
    }
    return true;
  }),
];

module.exports = passwordValidation;
