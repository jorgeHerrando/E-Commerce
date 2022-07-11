var express = require("express");
var router = express.Router();
//Aquí llamo al middleware de autenticación. De esta forma aseguro que sólo el usuario logueado pueda ingresar productos al carrito de compras
const authMiddleware = require("../middlewares/authMiddleware");

//Aqui incorporo el middleware que se encarga de validar que la cantidad de productos a incluir al carrito no sea cero
const cartValidator = require("../middlewares/cartAmountValidation");

// ************ Controller Require ************
const cartController = require("../controllers/cartController");

router.post(
  "/addToCart",
  authMiddleware,
  cartValidator,
  cartController.addCart
);
router.get("/cartDetail", authMiddleware, cartController.cart);
router.post("/deleteElement", authMiddleware, cartController.deleteCart);
router.post("/checkout", authMiddleware, cartController.checkout);
router.get("/historialCompra", authMiddleware, cartController.history);
router.get("/orderDetail/:id", authMiddleware, cartController.buyDetail);

module.exports = router;
