const path = require("path");
const { body } = require("express-validator");

// const categories = [
//   "Snowboarding",
//   "Skateboarding",
//   "Surf",
//   "Wakeboarding",
//   "Accessory",
// ];
// const subcategories = [
//   "",
//   "Helmet",
//   "Gloves",
//   "Protection",
//   "Fin",
//   "Wax",
//   "Glasses",
// ];
// const brands = [
//   "Quicksilver",
//   "Billabong",
//   "Roxy",
//   "Patagonia",
//   "Hurley",
//   "Burton",
// ];
// const sizes = ["", "S", "M", "L"];

const validations = [
  body("name").notEmpty().withMessage("Tienes que escribir un nombre"),
  body("description")
    .notEmpty()
    .withMessage("Tienes que escribir una descripción para el producto"),
  body("category")
    .notEmpty()
    .withMessage("Tienes que seleccionar una categoría"),
  // .bail()
  // .isIn(categories) //por si cambian el valor en el browser
  // .withMessage("La categoría no corresponde con ningún valor válido"),
  body("subcategory").optional(),
  // .isIn(subcategories) //por si cambian el valor en el browser
  // .withMessage("Valor no aceptado"),
  body("brand").notEmpty().withMessage("Tienes que seleccionar una marca"),
  // .bail()
  // .isIn(brands) //por si cambian el valor en el browser
  // .withMessage("La marca no corresponde con ningún valor válido"),
  body("price")
    .notEmpty()
    .withMessage("Tienes que marcar un precio")
    .bail()
    .isNumeric()
    .withMessage("Tienes que escribir un valor numérico"),
  body("discount")
    .notEmpty()
    .withMessage("Tienes que marcar un descuento. Si no lo tiene, introduce 0")
    .bail()
    .isNumeric()
    .withMessage("Tienes que escribir un valor numérico"),
  body("sale").notEmpty().withMessage("Tienes que marcar si está en promoción"),

  body("tag")
    .notEmpty()
    .withMessage("Tienes que poner al menos un tag para el producto creado"),
  body("image").custom((value, { req }) => {
    let file = req.files;
    let acceptedExtensions = [".jpg", ".png", ".gif"];

    if (file.length >= 1) {
      //probe mil cosas y es la única que funciona
      for (const onefile of file) {
        let fileExtension = path.extname(onefile.originalname);
        if (!acceptedExtensions.includes(fileExtension)) {
          throw new Error(
            `Las extensiones de archivo permitidas son ${acceptedExtensions.join(
              ", "
            )}`
          );
        }
      }
    }
    return true;
  }),
];

module.exports = validations;
