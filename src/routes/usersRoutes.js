// ************ Require's ************
const express = require("express");
const router = express.Router();

// ************ Validations ************
const upload = require("../middlewares/multerValidationUser");
const validations = require("../middlewares/registerValidation");

// ************ Controller Require ************
const usersController = require("../controllers/usersController");

// Formulario de registro
router.get("/register", usersController.register);

// Procesar registro
router.post(
  "/register",
  upload.single("avatar"),
  validations,
  usersController.createUser
);

// Formulario de login
router.get("/login", usersController.login);
// router.post("/login", usersController.processLogin);

// Perfil de usuario
// router.get("/profile/:userId", usersController.profile);
// router.get("/adminRegister", usersController.admin);

module.exports = router;
