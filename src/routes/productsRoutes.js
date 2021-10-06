// ************ Require's ************
const express = require("express");
const router = express.Router();

// ************ Validations ************
const upload = require("../middlewares/multerValidationProduct");
const validationsCreate = require("../middlewares/createProductValidation");
const validationsEdit = require("../middlewares/editProductValidation");

const adminMiddleware = require("../middlewares/adminMiddleware");

// ************ Controller Require ************
const productsController = require("../controllers/productsController");

/*** GET ALL PRODUCTS ***/
router.get("/", productsController.shop);

/*** GET ONSALE PRODUCTS ***/
router.get("/onsale", productsController.onsale);

/*** SEARCH PRODUCTS ***/
router.get("/search", productsController.search);

/*** CREATE ONE PRODUCT ***/
router.get("/create", adminMiddleware, productsController.create); //manda vista del form a través del método create del controlador
router.post(
  "/create",
  upload.array("image", 6),
  validationsCreate,
  productsController.store
);

/*** GET ONE PRODUCT ***/
router.get("/detail/:id", productsController.detail);

/*** EDIT ONE PRODUCT ***/
router.get("/:id/edit", adminMiddleware, productsController.productEditView); // manda el form de edición con toda la data del producto a editar
router.put(
  "/:id",
  upload.array("image", 6),
  validationsEdit,
  productsController.productEditUpload
); // edita el product

/*** DELETE ONE PRODUCT***/
router.delete("/:id", adminMiddleware, productsController.destroy);

/*** IR AL CARRITO ***/
router.get("/productCart", productsController.productCart);

/*** GET ALL PRODUCTS and FILTER THEM BY CATEGORY ***/
router.get("/:category?", productsController.shop);

module.exports = router;
