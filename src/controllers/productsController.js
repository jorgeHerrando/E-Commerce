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
    let products;
    // llamamos a todos los productos con sus img y category
    try {
      products = await db.Product.findAll({
        include: ["images", "category"],
      });
      // si hay errores redirigimos al main. Para que no quede colgado
    } catch (e) {
      return res.redirect("/");
    }
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
      // si no hay categoría, muestra todos
    } else {
      productsToShow = products;
      return res.render("products/shop", {
        products: productsToShow,
      });
    }
  },

  onsale: async (req, res) => {
    let onsale = "En descuento";
    let products;
    try {
      products = await db.Product.findAll({
        include: ["images"],
        where: {
          sale: 1,
        },
      });
    } catch (e) {
      res.redirect("/");
    }
    return res.render("products/shop", {
      products,
      onsale,
    });
  },

  search: async (req, res) => {
    // recogemos el query de la url
    let tagUser = req.query.search;
    // lo que mostraremos
    let productsToShow = [];
    // traemos los tags que coincidan con lo que puso el user
    let tags;
    try {
      tags = await db.Tag.findAll({
        where: {
          name: {
            [Op.like]: `%${tagUser}%`,
          },
        },
      });
    } catch (e) {
      res.redirect("/");
    }

    // traigo todos los products
    let products;
    try {
      products = await db.Product.findAll({
        include: ["images", "tags"],
      });
    } catch (e) {
      res.redirect("/");
    }

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

    let product;
    try {
      //encontramos el elem con el mismo id en nuestra DB e incluimos img, sizes y brand
      product = await db.Product.findByPk(id, {
        include: ["images", "sizes", "brand"],
      });
    } catch (e) {
      res.redirect("/");
    }

    return res.render("products/productDetail", {
      detailProduct: product, //mandamos el producto que deseamos
    });
  },

  create: (req, res) => {
    let categoriesDB = db.Category.findAll();
    let subcategoriesDB = db.Subcategory.findAll();
    let brandsDB = db.Brand.findAll();
    let sizesDB = db.Size.findAll();
    let tagsDB = db.Tag.findAll();

    Promise.all([categoriesDB, subcategoriesDB, brandsDB, sizesDB, tagsDB])
      .then(function ([categories, subcategories, brands, sizes, tags]) {
        return res.render("products/createProduct", {
          categories,
          subcategories,
          brands,
          sizes,
          tags,
        });
      })
      .catch((e) => res.redirect("/"));
  },

  store: async (req, res) => {
    const resultValidation = validationResult(req);

    // si hay errores
    if (resultValidation.errors.length > 0) {
      let categoriesDB = db.Category.findAll();
      let subcategoriesDB = db.Subcategory.findAll();
      let brandsDB = db.Brand.findAll();
      let sizesDB = db.Size.findAll();
      let tagsDB = db.Tag.findAll();

      Promise.all([categoriesDB, subcategoriesDB, brandsDB, sizesDB, tagsDB])
        .then(function ([categories, subcategories, brands, sizes, tags]) {
          // devuelvo la vista con errores y la info necesaria
          return res.render("products/createProduct", {
            errors: resultValidation.mapped(), //convierto el array errors en obj.literal
            oldData: req.body,
            categories,
            subcategories,
            brands,
            sizes,
            tags,
          });
        })
        .catch((e) => res.send(e));
      // si no
    } else {
      const newProduct = await db.Product.create({
        name: req.body.name,
        description: req.body.description,
        category_id: req.body.category,
        subcategory_id: req.body.subcategory ? req.body.subcategory : null, // si el valor que llega es vacío, ponle null
        brand_id: req.body.brand,
        price: Number(req.body.price),
        discount: Number(req.body.discount),
        sale: parseInt(req.body.sale),
      });

      // IMAGES
      // con req.files accedemos a todos los file mandados y guardados en array. Solo queremos el nombre así que creamos nuevo array donde los pushearemos
      let images = [];
      for (i = 0; i < req.files.length; i++) {
        images.push(req.files[i].filename);
      }
      for (i = 0; i < images.length; i++) {
        // ahora con uuid ya no son 2 iguales y creara tantas imagenes como haya en el array
        await newProduct.createImage({ name: images[i] });
      }

      // SIZES
      const size = req.body.size;
      // añadimos sizes ya creadas add + nombre asociacion con mayusculas y puede ser plural
      await newProduct.addSizes(size);

      // STOCK
      const stock = parseInt(req.body.stock);
      // añadimos stocks nuevos
      await newProduct.createStock({ amount: stock, size_id: size }, {});

      // TAGS
      const tags = req.body.tag;
      // añadimos tags ya creados
      await newProduct.addTags(tags);

      let newProductId = newProduct.id;
      return res.redirect("/products/detail/" + newProductId);
    }
    // .catch((e) => res.send(e));
  },

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

  productEditView: async (req, res) => {
    // recuperamos el ID
    let id = req.params.id;

    // traemos lo necesario para el form
    let categories = await db.Category.findAll();
    let subcategories = await db.Subcategory.findAll();
    let brands = await db.Brand.findAll();
    let sizes = await db.Size.findAll();
    let tags = await db.Tag.findAll();

    // buscamos el producto
    let editProduct = await db.Product.findByPk(id, {
      include: ["images", "tags", "brand", "category", "subcategory", "sizes"],
    });

    return res.render("products/productEdit", {
      editProduct,
      categories,
      subcategories,
      brands,
      sizes,
      tags,
    });
  },
  productEditUpload: async (req, res) => {
    const resultValidation = validationResult(req);
    let id = req.params.id;

    // si hay errores
    if (resultValidation.errors.length > 0) {
      let categories = await db.Category.findAll();
      let subcategories = await db.Subcategory.findAll();
      let brands = await db.Brand.findAll();
      let sizes = await db.Size.findAll();
      let tags = await db.Tag.findAll();

      // buscamos el producto
      let editProduct = await db.Product.findByPk(id, {
        include: [
          "images",
          "tags",
          "brand",
          "category",
          "subcategory",
          "sizes",
        ],
      });

      // devuelvo la vista con errores y la info necesaria
      return res.render("products/productEdit", {
        errors: resultValidation.mapped(), //convierto el array errors en obj.literal
        oldData: req.body,
        editProduct,
        categories,
        subcategories,
        brands,
        sizes,
        tags,
      });

      // si no hay errores
    } else {
      await db.Product.update(
        {
          name: req.body.name,
          description: req.body.description,
          category_id: req.body.category,
          subcategory_id: req.body.subcategory ? req.body.subcategory : null, // si el valor que llega es vacío, ponle null
          brand_id: req.body.brand,
          price: Number(req.body.price),
          discount: Number(req.body.discount),
          sale: parseInt(req.body.sale),
        },
        {
          where: {
            id: id,
          },
        }
      );

      // llamamos al producto con data principal actualizada
      const editedProduct = await db.Product.findByPk(id, {
        include: ["images", "tags"],
      });
      // IMAGES
      // con req.files accedemos a todos los file mandados y guardados en array. Solo queremos el nombre así que creamos nuevo array donde los pushearemos
      let images = [];
      for (i = 0; i < req.files.length; i++) {
        images.push(req.files[i].filename);
      }
      for (i = 0; i < images.length; i++) {
        // ahora con uuid ya no son 2 iguales y creara tantas imagenes como haya en el array
        await editedProduct.createImage({ name: images[i] });
      }

      // TAGS
      const tags = req.body.tag; // tags recogidos
      const numberTags = tags.map((elem) => parseInt(elem));

      await editedProduct.setTags(numberTags);

      return res.redirect("/products/detail/" + id);
    }
  },

  destroy: async (req, res) => {
    // recuperamos el ID
    let id = req.params.id;
    // buscamos el producto a eliminar
    const product = await db.Product.findByPk(id);
    // le quitamos las asocicaciones
    await product.removeImages([id]);

    await product.setTags([]);

    await product.setSizes([]);

    await product.removeStocks([id]);

    // eliminamos el producto
    await db.Product.destroy({
      where: {
        id: id,
      },
    });

    return res.redirect("/"); //redireccionamos al home
  },
  // // ////////////////////////////////////

  // // products pasa a ser un array de todos los productos excepto del que queremos eliminar
  // products = products.filter((elem) => elem.id != id);

  // let productsJSON = JSON.stringify(products); // lo pasamos a JSON
  // fs.writeFileSync(productsFilePath, productsJSON); //escribimos la nueva DB
};
module.exports = productsController;
