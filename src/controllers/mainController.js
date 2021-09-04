const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/products.json"); //ruta a nuestra DB JSON
let products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8")); // pasamos de formato JSON a JS

const mainController = {
  index: (req, res) => {
    sales = products.filter((elem) => elem.sale == true);
    res.render("index", {
      title: "Havenboards",
      sales: sales,
    });
  },
  info: (req, res) => {
    res.render("main/info", { title: "Havenboards - Info" });
  },
};
module.exports = mainController;
