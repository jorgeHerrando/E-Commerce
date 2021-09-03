// ************ Require's ************
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
// Para poder usar los métodos PUT y DELETE

// ************ express() ************
const app = express();

// ************ Middlewares ************

app.use(express.static("public")); // Necesario para los archivos estáticos en el folder /public
app.use(express.urlencoded({ extended: false })); // to recognize the incoming Request Object as strings or arrays
app.use(express.json()); // to recognize the incoming Request Object as a JSON Object
app.use(methodOverride("_method")); // Pasar poder pisar el method="POST" en el formulario por PUT y DELETE

// ************ Template Engine ************

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views")); // express accede directamente a views a la hora de renderizar si está en la raíz del proyecto. Si no (está dentro de 'src'), hay que darle la ruta con el siguiente comando

// ************ Route System require and use() ************

const mainRouter = require("./src/routes/main");
const usersRouter = require("./src/routes/users");
const productsRouter = require("./src/routes/products");

app.use("/", mainRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

// ************ catch 404 and forward to error handler ************
app.use((req, res, next) => {
  res.status(404).render("./main/404", { title: "Havenboards - Not found" });
  next();
});

let mensaje = () => {
  console.log("Servidor funcionando en puerto 3000");
};

app.listen(3000, mensaje());

// ************ exports app ************
// module.exports = app;
