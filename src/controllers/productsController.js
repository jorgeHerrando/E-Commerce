const fs = require("fs");
const path = require("path");

const removeDuplicates = require("../helpers/removeDuplicates");

const db = require("../database/models");
const Op = db.Sequelize.Op;

const { validationResult } = require("express-validator");

// ------- JSON ------- //
// const productsFilePath = path.join(__dirname, "../data/products.json"); //ruta a nuestra DB JSON
// let products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8")); // pasamos de formato JSON a JS

const productsController = {
  shop: async (req, res) => {
    // recogemos el param
    let category = req.params.category;
    // llamamos a todos los productos con sus img y category
    let products = await db.Product.findAll({
      include: ["images", "category"],
    });
    // variable que nos dirá qué mostrar en la vista
    let productsToShow;

    // si llegan params
    if (category) {
      // filtrame por categoría que llega
      productsToShow = products.filter(
        (product) => product.category.name.toLowerCase() == category
      );

      // si hay coincidencias con category
      if (productsToShow != "") {
        // mandamos la vista con lo que queremos
        return res.render("products/shop", {
          products: productsToShow,
          category: productsToShow[0].category,
        });
        // si no 404
      } else {
        return res.render("./main/404");
      }
      // si no todos
    } else {
      productsToShow = products;
      return res.render("products/shop", {
        products: productsToShow,
      });
    }
  },

  onsale: async (req, res) => {
    let onsale = "En descuento";
    let products = await db.Product.findAll({
      include: ["images"],
      where: {
        sale: 1,
      },
    });
    return res.render("products/shop", {
      products,
      onsale,
    });
  },

  search: async (req, res) => {
    let tagUser = req.query.search;
    let productsToShow = [];
    let tags = await db.Tag.findAll({
      where: {
        name: {
          [Op.like]: `%${tagUser}%`,
        },
      },
    });

    let products = await db.Product.findAll({
      include: ["images", "tags"],
    });

    // me manda todos repetidos por cada tag que contiene el objeto y coincide
    for (let product of products) {
      for (let productTag of product.tags) {
        for (let tag of tags) {
          if (tag.name == productTag.name) {
            productsToShow.push(product);
          }
        }
      }
    }

    // quitamos duplicados
    productsToShow = removeDuplicates(productsToShow);

    return res.render("products/shop", {
      products: productsToShow,
    });
  },

  productCart: (req, res) => {
    res.render("products/productCart");
  },

  detail: async (req, res) => {
    const id = req.params.id; //recuperamos el param del url

    //encontramos el elem con el mismo id en nuestra DB e incluimos img y sizes
    const product = await db.Product.findByPk(id, {
      include: ["images", "sizes", "brand"],
    });

    return res.render("products/productDetail", {
      detailProduct: product, //mandamos el producto que deseamos
    });
  },

  create: (req, res) => {
    let categoriesDB = db.Category.findAll();
    let subcategoriesDB = db.Subcategory.findAll();
    let brandsDB = db.Brand.findAll();
    let sizesDB = db.Size.findAll();

    Promise.all([categoriesDB, subcategoriesDB, brandsDB, sizesDB]).then(
      function ([categories, subcategories, brands, sizes]) {
        return res.render("products/createProduct", {
          categories,
          subcategories,
          brands,
          sizes,
        });
      }
    );
  },

  store: async (req, res) => {
    const resultValidation = validationResult(req);

    if (resultValidation.errors.length > 0) {
      let categoriesDB = db.Category.findAll();
      let subcategoriesDB = db.Subcategory.findAll();
      let brandsDB = db.Brand.findAll();
      let sizesDB = db.Size.findAll();

      Promise.all([categoriesDB, subcategoriesDB, brandsDB, sizesDB])
        .then(function ([categories, subcategories, brands, sizes]) {
          return res.render("products/createProduct", {
            errors: resultValidation.mapped(), //convierto el array errors en obj.literal
            oldData: req.body,
            categories,
            subcategories,
            brands,
            sizes,
          });
        })
        .catch((e) => res.send(e));
    } else {
      // con req.files accedemos a todos los file mandados y guardados en array. Solo queremos el nombre así que creamos nuevo array donde los pushearemos
      let images = [];
      for (i = 0; i < req.files.length; i++) {
        images.push(req.files[i].filename);
      }

      const newProduct = db.Product.create({
        name: req.body.name,
        description: req.body.description,
        // le pasamos el array con los nombres
        // images: [
        //   {
        //     name: images,
        //   },
        // ],
        category_id: req.body.category,
        subcategory_id: req.body.subcategory ? req.body.subcategory : null, // si el valor que llega es vacío, ponle null
        brand_id: req.body.brand,
        price: Number(req.body.price),
        // sizes: req.body.size ? { name: req.body.size } : { name: null }, // si el valor que llega es vacío, ponle null
        discount: Number(req.body.discount),
        sale: Number(req.body.sale),
      }).then(
        function (data) {
          const size = req.body.size;
          data.addSizes(size);
          // console.log(data.name);
          // data.setSize({where:{name:req.body.size}});
          return res.redirect(`/products/detail/${data.id}`, {
            detailProduct: data,
          });
        }
        // ,
        // {
        //   include: { association: "sizes" },
        // }
      );
      // .catch(e => res.send(e));

      // return res.redirect("/products/detail/3");
    }

    // -------- JSON -------- //
    // crear nuevo id para producto creado
    // let newId = products[products.length - 1].id + 1;

    // le damos los valores al nuevo producto de cada uno de los campos del form
    // let newProduct = {
    //   name: req.body.name,
    //   description: req.body.description,
    //   // le pasamos el array con los nombres
    //   image: images,
    //   category: req.body.category,
    //   subcategory: req.body.subcategory ? req.body.subcategory : null, // si el valor que llega es vacío, ponle null
    //   brand: req.body.brand,
    //   price: Number(req.body.price),
    //   size: req.body.size ? req.body.size : null, // si el valor que llega es vacío, ponle null
    //   discount: Number(req.body.discount),
    //   sale: Number(req.body.sale),
    // };

    // -------- JSON -------- //
    // // agregamos nuevo producto
    // products.push(newProduct);

    // -------- JSON -------- //
    // reescribimos la BD en formato JSON
    // fs.writeFileSync(productsFilePath, JSON.stringify(products));
  },

  productEditView: (req, res) => {
    let id = req.params.id;

    let editProduct = products.find((elem) => elem.id == id);

    res.render("products/productEdit", {
      editProduct: editProduct,
    });
  },
  productEditUpload: (req, res) => {
    let id = req.params.id;

    let editedProduct = products.find((elem) => elem.id == id);

    const resultValidation = validationResult(req);

    if (resultValidation.errors.length > 0) {
      return res.redirect("products/productEdit", {
        editProduct: editedProduct,
        errors: resultValidation.mapped(), //convierto el array errors en obj.literal
        oldData: req.body,
      });
    }

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
