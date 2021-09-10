// ************ Require's ************
const express = require("express");
const router = express.Router();

// ************ Validations/Middlewares ************
const upload = require("../middlewares/multerValidationUser");
const registerValidation = require("../middlewares/registerValidation");
const loginValidation = require("../middlewares/loginValidation");
const guestMiddleware = require("../middlewares/guestMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

// ************ Controller Require ************
const usersController = require("../controllers/usersController");

// Formulario de registro
router.get("/register", guestMiddleware, usersController.register);

// Procesar registro
router.post(
  "/register",
  upload.single("avatar"),
  registerValidation,
  usersController.createUser
);

// Formulario de login
router.get("/login", guestMiddleware, usersController.login);

// Procesar el login
router.post("/login", loginValidation, usersController.processLogin);

// Perfil de usuario
router.get("/profile", authMiddleware, usersController.profile);

// Logout
router.get("/logout", usersController.logout);
// router.get("/adminRegister", usersController.admin);

module.exports = router;
