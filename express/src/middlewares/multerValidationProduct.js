const path = require("path");
const multer = require("multer");
// para que multer no cree dos filenames iguales con Date.now(). a veces los crea muy rapido y son iguales. luego da error en el controlador
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname + "../../../public/images/products")); //ruta donde se guardarán los archivos subidos a los form
  },
  // esto lo hace por cada file. Para acceder a un array se hace desde req.fileS
  filename: (req, file, cb) => {
    let uniqueName = uuidv4();
    let fileName = `${uniqueName}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

let upload = multer({ storage: storage });

// let upload = multer({
//   storage: storage,
//   fileFilter: function (req, file, cb) {
//     let ext = path.extname(file.originalname);
//     if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
//       return cb(new Error("Only images are allowed"));
//     }
//     cb(null, true);
//   },
// });

module.exports = upload;
