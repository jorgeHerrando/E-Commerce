// ************ Require's ************
const express = require("express");
const router = express.Router();

// ************ Controller Require ************
const apiProductsController = require("../../controllers/api/apiProductsController");

// Listado de users
router.get("/", apiProductsController.list); //para listar todos los products
router.get("/last", apiProductsController.lastProduct); //para listar todos los products

router.get("/categories", apiProductsController.categories); //para categorías
router.get("/subcategories", apiProductsController.subcategories); //para subcategorías

router.get("/brands", apiProductsController.brands); //para marcas

router.get("/orders", apiProductsController.orders); //para orders

router.get("/:id", apiProductsController.detail); //para dar detalle de un user

module.exports = router;