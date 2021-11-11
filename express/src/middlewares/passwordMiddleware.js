const { body } = require("express-validator");

// para validar que ambas contraseñas son iguales
const passwordValidation = [
  body("password")
    .notEmpty()
    .withMessage("Tienes que escribir un password")
    .bail()
    .isLength({ min: 8, max: 20 })
    .withMessage(
      "La contraseña debe tener al menos 8 dígitos, incluir una mayúscula, una minúscula, un número y un carácter especial('#?!@$%^&*-')"
    )
    .matches("[0-9]")
    .withMessage(
      "La contraseña debe tener al menos 8 dígitos, incluir una mayúscula, una minúscula, un número y un carácter especial('#?!@$%^&*-')"
    )
    .matches("[A-Z]")
    .withMessage(
      "La contraseña debe tener al menos 8 dígitos, incluir una mayúscula, una minúscula, un número y un carácter especial('#?!@$%^&*-')"
    )
    .matches("[#?!@$%^&*-]")
    .withMessage(
      "La contraseña debe tener al menos 8 dígitos, incluir una mayúscula, una minúscula, un número y un carácter especial('#?!@$%^&*-')"
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
