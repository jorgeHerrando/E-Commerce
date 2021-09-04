// ************ Require's ************
const express = require("express");
const router = express.Router();
const path = require("path");

const multer = require("multer");

 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname + "../../../public/images/tall")); //ruta donde se guardarán los archivos subidos a los form
  },
  // esto lo hace por cada file. Para acceder a un array se hace desde req.fileS
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});


let upload = multer({ storage: storage });

// ************ Controller Require ************
const productsController = require("../controllers/productsController");

/*** GET ALL PRODUCTS ***/
router.get("/", productsController.shop);

/*** CREATE ONE PRODUCT ***/
router.get("/create", productsController.create); //manda vista del form a través del método create del controlador
router.post("/", upload.array("image"), productsController.store);

/*** GET ONE PRODUCT ***/
router.get("/detail/:id", productsController.detail);

/*** EDIT ONE PRODUCT ***/
router.get("/:id/edit", productsController.productEditView); // manda el form de edición con toda la data del producto a editar
router.put("/:id", upload.array("image"), productsController.productEditUpload);

/*** DELETE ONE PRODUCT***/
router.delete("/:id", productsController.destroy);

/*** IR AL CARRITO ***/
router.get("/productCart", productsController.productCart);

module.exports = router;
