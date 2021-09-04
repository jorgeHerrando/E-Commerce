const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/products.json"); //ruta a nuestra DB JSON
let products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8")); // pasamos de formato JSON a JS

// esto era de prueba
const categoria = ["Snowboard"];

const productsController = {
  shop: (req, res) => {
    res.render("products/shop", {
      title: "Havenboards - Tienda",
      products: products, //le pasamos todos los productos con todas sus key:value
    });
  },
  productCart: (req, res) => {
    res.render("products/productCart", {
      title: "Havenboards - Shopping Cart",
    });
  },
  detail: (req, res) => {
    let id = req.params.id; //recuperamos el param del url

    let detailProduct = products.find((elem) => elem.id == id); //encontramos el elem con el mismo id en nuestra DB ya transformada

    res.render("products/productDetail", {
      title: "Havenboards - Product Detail",
      detailProduct: detailProduct, //mandamos el producto que deseamos
    });
  },
  create: (req, res) => {
    res.render("products/createProduct", {
      title: "Havenboards - Loading Product",
    });
  },
  store: (req, res) => {
    // con req.files accedemos a todos los file mandados y guardados en array. Solo queremos el nombre así que creamos nuevo array donde los pushearemos
    let images = [];
    for (i = 0; i < req.files.length; i++) {
      images.push(req.files[i].originalname);
    }

    // crear nuevo id para producto creado
    let newId = products[products.length - 1].id + 1;

    // le damos los valores al nuevo producto de cada uno de los campos del form
    let newProduct = {
      name: req.body.name,
      id: newId,
      description: req.body.description,
      // le pasamos el array con los nombres
      image: images,
      category: req.body.category,
      subcategory: req.body.subcategory ? req.body.subcategory : null, // si el valor que llega es vacío, ponle null
      brand: req.body.brand,
      price: Number(req.body.price),
      size: req.body.size ? req.body.size : null, // si el valor que llega es vacío, ponle null
      discount: Number(req.body.discount),
      sale: Boolean(req.body.sale),
    };

    // agregamos nuevo producto
    products.push(newProduct);

    // reescribimos la BD en formato JSON
    fs.writeFileSync(productsFilePath, JSON.stringify(products));

    res.redirect("/products/detail/" + newId);
  },

  productEditView: (req, res) => {
    let id = req.params.id;

    let editProduct = products.find((elem) => elem.id == id);

    res.render("products/productEdit", {
      title: "Havenboards - Editing Product",
      editProduct: editProduct,
    });
  },
  productEditUpload: (req, res) => {
    let id = req.params.id;

    let editedProduct = products.find((elem) => elem.id == id);
    // con req.files accedemos a todos los file mandados y guardados en array. Solo queremos el nombre así que creamos array con lo anterior donde los pushearemos
    let images = editedProduct.image;
    for (i = 0; i < req.files.length; i++) {
      images.push(req.files[i].originalname);
    }

    // cambiamos los values de las key
    editedProduct.name = req.body.name;
    editedProduct.description = req.body.description;
    editedProduct.image = images; // le pasamos el array con los nombres de img
    editedProduct.category = req.body.category;
    editedProduct.subcategory = req.body.subcategory
      ? req.body.subcategory
      : null; // si el valor que llega es vacío, ponle null
    editedProduct.brand = req.body.brand;
    editedProduct.price = Number(req.body.price);
    editedProduct.size = req.body.size ? req.body.size : null; // si el valor que llega es vacío, ponle null
    editedProduct.discount = Number(req.body.discount);
    editedProduct.sale = Boolean(req.body.sale);
    console.log(products);

    fs.writeFileSync(productsFilePath, JSON.stringify(products));

    res.redirect("/products/detail/" + id);
  },

  destroy: (req, res) => {
    let id = req.params.id;

    // products pasa a ser un array de todos los productos excepto del que queremos eliminar
    products = products.filter((elem) => elem.id != id);

    let productsJSON = JSON.stringify(products); // lo pasamos a JSON
    fs.writeFileSync(productsFilePath, productsJSON); //escribimos la nueva DB
    res.redirect("/"); //redireccionamos al home
  },
};
module.exports = productsController;
