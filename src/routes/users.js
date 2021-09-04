// ************ Require's ************
const express = require("express");
const router = express.Router();
const path = require("path");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname + "../../../public/images/users")); //ruta donde se guardarán los archivos subidos a los form
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
let upload = multer({ storage: storage });

const usersController = require("../controllers/usersController");

router.post("/", upload.single("image"), usersController.createUser);
router.get("/login", usersController.login);

router.get("/register", usersController.register);
// router.get("/adminRegister", usersController.admin);

router.post("/", upload.single("image"), usersController.createUser);

module.exports = router;
