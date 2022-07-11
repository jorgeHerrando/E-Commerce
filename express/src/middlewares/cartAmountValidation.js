const path = require("path");
const { body } = require("express-validator");

const validations = [
  body("amount")
    .custom((value) => value > 0)
    .withMessage("Debe agregar al menos un producto a su carrito"),
];

module.exports = validations;
