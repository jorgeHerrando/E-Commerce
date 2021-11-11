const fs = require("fs");
const path = require("path");

const db = require("../database/models");

// ------- JSON ------- //
// const productsFilePath = path.join(__dirname, "../data/products.json"); //ruta a nuestra DB JSON
// let products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8")); // pasamos de formato JSON a JS

const mainController = {
  index: async (req, res) => {
    let products = await db.Product.findAll({
      include: ["images"],
      limit: 4,
      where: {
        sale: 1,
      },
    });

    // sales = products.filter((elem) => elem.sale == true);
    return res.render("index", {
      sales: products,
    });
  },
  info: (req, res) => {
    res.render("main/info", { title: "Havenboards - Info" });
  },
};
module.exports = mainController;
