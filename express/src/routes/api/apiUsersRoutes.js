// ************ Require's ************
const express = require("express");
const router = express.Router();

// ************ Controller Require ************
const apiUsersController = require("../../controllers/api/apiUsersController");

// Listado de users
router.get("/", apiUsersController.list); //para listar todos los users

router.get("/:id", apiUsersController.detail); //para dar detalle de un user

module.exports = router;
