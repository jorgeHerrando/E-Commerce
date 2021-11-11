const fs = require("fs");
const path = require("path");

// HELPERS
const removeDuplicates = require("../helpers/removeDuplicates");
const capFirstLetter = require("../helpers/capFirstLetter");

// DB
const db = require("../database/models");
const Op = db.Sequelize.Op;

// VALIDATIONS
const { validationResult } = require("express-validator");
const { pathToFileURL } = require("url");

// ------- JSON ------- //
// const productsFilePath = path.join(__dirname, "../data/products.json"); //ruta a nuestra DB JSON
// let products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8")); // pasamos de formato JSON a JS

// CONTROLADOR
const productsController = {
  // MUESTRA PRODUCTOS
  shop: async (req, res) => {
    // recogemos query strings del paginado si los hay
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);

    // definimos la paginación y número de productos a mostrar
    let page = 0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }
    let size = 8;
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber <= 12) {
      size = sizeAsNumber;
    }

    // recogemos el param category si lo hay
    let category = req.params.category;
    let products;
    // llamamos a todos los productos con sus img y category
    try {
      // nos devuelve un count
      products = await db.Product.findAndCountAll({
        // para que solo cuente objetos y no asociaciones
        distinct: true,
        // para paginar
        limit: size,
        offset: page * size,
        include: ["images", "category"],
      });
      // si hay errores redirigimos al main. Para que no quede colgado
    } catch (e) {
      return res.redirect("/");
    }
    // variable que nos dirá qué mostrar en la vista
    let productsToShow;

    // si llegan params category
    if (category) {
      // buscamos la categoría que coincide
      let productsCategory = await db.Category.findOne({
        where: {
          // ponemos la primera en mayúscula que es como está en la DB
          name: capFirstLetter(category),
        },
      });
      // si se encuentra alguna categoría en la DB
      if (productsCategory) {
        // búscame aquellos que tienen esa categoría
        // devuelve count y rows
        productsToShow = await db.Product.findAndCountAll({
          // para que solo cuente objetos y no asociaciones
          distinct: true,
          limit: size,
          offset: page * size,
          include: ["images", "category"],
          where: {
            category_id: productsCategory.id,
          },
        });
      }
      // filtrame por categoría que llega
      // productsToShow = products.rows.filter(
      //   (product) => product.category.name == capFirstLetter(category)
      // );

      // si hay productos que mostrar
      if (productsToShow) {
        // mandamos la vista con lo que queremos
        return res.render("products/shop", {
          // sólo queremos enviar lo que hay en rows
          products: productsToShow.rows,
          category: productsCategory,
          totalPages: Math.ceil(productsToShow.count / size),
          size: size,
        });
        // si no 404
      } else {
        return res.render("./main/404");
      }
      // si no hay categoría, muestra todos
    } else {
      productsToShow = products;

      return res.render("products/shop", {
        products: productsToShow.rows,
        // aquí podemos contarlo
        // ceil lo redondea hacia arriba para la última página
        totalPages: Math.ceil(productsToShow.count / size),
        size: size,
      });
    }
  },

  brands: (req, res) => {
    db.Brand.findAll()
      .then((brands) => {
        console.log(brands);
        res.render("products/brands", {
          brands: brands,
        });
      })
      .catch((e) => res.send(e));
  },

  brandSelected: async (req, res) => {
    // recogemos param de la marca
    let brand = req.params.brand;

    // seteamos limit y offset
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);
    let page = 0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }
    let size = 8;
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber <= 12) {
      size = sizeAsNumber;
    }

    let brandToShow;
    let productsToShow;
    // encontramos la marca
    try {
      brandToShow = await db.Brand.findOne({
        where: {
          name: brand,
        },
      });
    } catch (e) {
      return res.send(e);
    }

    // encontramos los porudctos con esa marca
    try {
      productsToShow = await db.Product.findAndCountAll({
        limit: size,
        // para que solo cuente objetos y no asociaciones
        distinct: true,
        offset: page * size,
        include: ["images", "category"],
        where: {
          brand_id: brandToShow.id,
        },
      });
    } catch (e) {
      return res.send(e);
    }

    // renderizamos vista
    return res.render("products/shop", {
      products: productsToShow.rows,
      brand: brandToShow,
      totalPages: Math.ceil(productsToShow.count / size),
      size: size,
    });
  },

  onsale: async (req, res) => {
    // recogemos query strings del paginado
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);

    // definimos la paginación y número de productos a mostrar
    let page = 0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }
    let size = 8;
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 12) {
      size = sizeAsNumber;
    }

    let onsale = "En descuento";
    let productsToShow;
    try {
      // encuentra todos los que estén en oferta
      productsToShow = await db.Product.findAndCountAll({
        distinct: true,
        limit: size,
        offset: page * size,
        include: ["images"],
        where: {
          sale: 1,
        },
      });
    } catch (e) {
      res.redirect("/");
    }
    return res.render("products/shop", {
      products: productsToShow.rows,
      onsale,
      totalPages: Math.ceil(productsToShow.count / size),
      size: size,
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
      // buscamos los tags que tengan la parte introducida por el usuario
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
    // por cada producto
    for (let product of products) {
      // por cada tag del producto
      for (let productTag of product.tags) {
        // por cada uno de los tags
        for (let tag of tags) {
          // comparame los tags
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
    // traemos todo lo necesario para el formulario
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
    }

    // Validación propia: existe el dato?
    // existe category?
    let categoryInDB = await db.Category.findOne({
      where: {
        id: Number(req.body.category),
      },
    });
    // existe subcategory?
    let subcategoryInDB = await db.Subcategory.findOne({
      where: {
        id: Number(req.body.subcategory),
      },
    });
    // existe brand?
    let brandInDB = await db.Brand.findOne({
      where: {
        id: Number(req.body.brand),
      },
    });
    // existe size?
    let sizeInDB = await db.Size.findOne({
      where: {
        id: Number(req.body.size),
      },
    });
    // existe tags?
    // rescatamos todos los tags
    let tagsInDB = await db.Tag.findAll();
    // chequearemos estos
    let tagsCheck = [];
    // los tags que vienen por form
    let tagsForm = req.body.tag;

    // si se manda más de un tag será un obj(array)
    if (typeof tagsForm == "object") {
      // por cada tag que llega del form
      for (let tagForm of tagsForm) {
        // por cada tag en DB
        for (let tagDB of tagsInDB) {
          // se comparan y si coinciden se pushea al array
          if (tagDB.id == tagForm) {
            tagsCheck.push(tagForm);
          }
        }
      }
      // si no es objeto, string un solo valor. Si no está vacío
    } else if (tagsForm !== "") {
      // por cada tag en DB
      for (let tagDB of tagsInDB) {
        // se comparan y si coinciden se pushea al array
        if (tagDB.id == tagsForm) {
          tagsCheck.push(tagsForm);
        }
      }
    }

    // si no hay errores. Existe la cat, subcat o bien es vacía, brand, size y existe tagsCheck con algún push...
    if (
      categoryInDB &&
      (subcategoryInDB || req.body.subcategory == "") &&
      brandInDB &&
      sizeInDB &&
      tagsCheck.length >= 1
    ) {
      // creamos producto
      const newProduct = await db.Product.create({
        name: req.body.name,
        description: req.body.description,
        category_id: Number(req.body.category),
        subcategory_id: req.body.subcategory
          ? Number(req.body.subcategory)
          : null, // si el valor que llega es vacío, ponle null
        brand_id: Number(req.body.brand),
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
      const size = Number(req.body.size);
      // añadimos sizes ya creadas add + nombre asociacion con mayusculas y puede ser plural
      await newProduct.addSizes(size);

      // STOCK
      const stock = parseInt(req.body.stock);
      // añadimos stocks nuevos
      await newProduct.createStock({ amount: stock, size_id: size }, {});

      // TAGS
      tagsCheck = tagsCheck.map((tag) => Number(tag));

      // añadimos tags ya creados
      await newProduct.addTags(tagsCheck);

      let newProductId = newProduct.id;

      return res.redirect("/products/detail/" + newProductId);

      // si llega algo que no existe en DB...
    } else {
      // llamamos a lo que necesitamos en el form
      let categoriesDB = await db.Category.findAll();
      let subcategoriesDB = await db.Subcategory.findAll();
      let brandsDB = await db.Brand.findAll();
      let sizesDB = await db.Size.findAll();
      let tagsDB = await db.Tag.findAll();

      // y dependiendo de lo que haya fallado...mandamos error correspondiente
      // ESTO SEGURAMENTE SE PUEDE REFACTORIZAR
      if (!categoryInDB) {
        return res.render("products/createProduct", {
          errors: {
            category: {
              msg: "La categoría no existe",
            },
          },
          oldData: req.body,
          categories: categoriesDB,
          subcategories: subcategoriesDB,
          brands: brandsDB,
          sizes: sizesDB,
          tags: tagsDB,
        });
      } else if (req.body.subcategory !== "") {
        return res.render("products/createProduct", {
          errors: {
            subcategory: {
              msg: "La subcategoría no existe",
            },
          },
          oldData: req.body,
          categories: categoriesDB,
          subcategories: subcategoriesDB,
          brands: brandsDB,
          sizes: sizesDB,
          tags: tagsDB,
        });
      } else if (!brandInDB) {
        return res.render("products/createProduct", {
          errors: {
            brand: {
              msg: "La marca no existe",
            },
          },
          oldData: req.body,
          categories: categoriesDB,
          subcategories: subcategoriesDB,
          brands: brandsDB,
          sizes: sizesDB,
          tags: tagsDB,
        });
      } else if (!sizeInDB) {
        return res.render("products/createProduct", {
          errors: {
            size: {
              msg: "La talla no existe",
            },
          },
          oldData: req.body,
          categories: categoriesDB,
          subcategories: subcategoriesDB,
          brands: brandsDB,
          sizes: sizesDB,
          tags: tagsDB,
        });
      } else if (tagsCheck.length < 1) {
        return res.render("products/createProduct", {
          errors: {
            tag: {
              msg: "La/s etiqueta/s no existe/n",
            },
          },
          oldData: req.body,
          categories: categoriesDB,
          subcategories: subcategoriesDB,
          brands: brandsDB,
          sizes: sizesDB,
          tags: tagsDB,
        });
      }
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
    }

    // Validación propia: existe el dato?
    // existe category?
    let categoryInDB = await db.Category.findOne({
      where: {
        id: Number(req.body.category),
      },
    });
    // existe subcategory?
    let subcategoryInDB = await db.Subcategory.findOne({
      where: {
        id: Number(req.body.subcategory),
      },
    });
    // existe brand?
    let brandInDB = await db.Brand.findOne({
      where: {
        id: Number(req.body.brand),
      },
    });
    // existe tags?
    // rescatamos todos los tags
    let tagsInDB = await db.Tag.findAll();
    // chequearemos estos
    let tagsCheck = [];
    // los tags que vienen por form
    let tagsForm = req.body.tag;

    // si se manda más de un tag será un obj(array)
    if (typeof tagsForm == "object") {
      // por cada tag que llega del form
      for (let tagForm of tagsForm) {
        // por cada tag en DB
        for (let tagDB of tagsInDB) {
          // se comparan y si coinciden se pushea al array
          if (tagDB.id == tagForm) {
            tagsCheck.push(tagForm);
          }
        }
      }
      // si no es objeto, string un solo valor. Si no está vacío
    } else if (tagsForm !== "") {
      // por cada tag en DB
      for (let tagDB of tagsInDB) {
        // se comparan y si coinciden se pushea al array
        if (tagDB.id == tagsForm) {
          tagsCheck.push(tagsForm);
        }
      }
    }

    // si no hay errores. Existe la cat, subcat o bien es vacía, brand, size y existe tagsCheck con algún push...
    if (
      categoryInDB &&
      (subcategoryInDB || req.body.subcategory == "") &&
      brandInDB &&
      tagsCheck.length >= 1
    ) {
      await db.Product.update(
        {
          name: req.body.name,
          description: req.body.description,
          category_id: Number(req.body.category),
          subcategory_id: req.body.subcategory
            ? Number(req.body.subcategory)
            : null, // si el valor que llega es vacío, ponle null
          brand_id: Number(req.body.brand),
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
      const numberTags = tagsCheck.map((tag) => Number(tag));

      // añadimos nuevos tags ya creados
      await editedProduct.setTags(numberTags);

      return res.redirect("/products/detail/" + id);
      // si llega algo que no existe en DB...
    } else {
      // llamamos a lo que necesitamos en el form
      let categoriesDB = await db.Category.findAll();
      let subcategoriesDB = await db.Subcategory.findAll();
      let brandsDB = await db.Brand.findAll();
      let sizesDB = await db.Size.findAll();
      let tagsDB = await db.Tag.findAll();
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

      // y dependiendo de lo que haya fallado...mandamos error correspondiente
      // ESTO SEGURAMENTE SE PUEDE REFACTORIZAR
      if (!categoryInDB) {
        return res.render("products/productEdit", {
          errors: {
            category: {
              msg: "La categoría no existe",
            },
          },
          oldData: req.body,
          editProduct,
          categories: categoriesDB,
          subcategories: subcategoriesDB,
          brands: brandsDB,
          sizes: sizesDB,
          tags: tagsDB,
        });
      } else if (req.body.subcategory !== "") {
        return res.render("products/productEdit", {
          errors: {
            subcategory: {
              msg: "La subcategoría no existe",
            },
          },
          oldData: req.body,
          editProduct,
          categories: categoriesDB,
          subcategories: subcategoriesDB,
          brands: brandsDB,
          sizes: sizesDB,
          tags: tagsDB,
        });
      } else if (!brandInDB) {
        return res.render("products/productEdit", {
          errors: {
            brand: {
              msg: "La marca no existe",
            },
          },
          oldData: req.body,
          editProduct,
          categories: categoriesDB,
          subcategories: subcategoriesDB,
          brands: brandsDB,
          sizes: sizesDB,
          tags: tagsDB,
        });
      } else if (tagsCheck.length < 1) {
        return res.render("products/productEdit", {
          errors: {
            tag: {
              msg: "La/s etiqueta/s no existe/n",
            },
          },
          oldData: req.body,
          editProduct,
          categories: categoriesDB,
          subcategories: subcategoriesDB,
          brands: brandsDB,
          sizes: sizesDB,
          tags: tagsDB,
        });
      }
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

  // JSON
  // // products pasa a ser un array de todos los productos excepto del que queremos eliminar
  // products = products.filter((elem) => elem.id != id);

  // let productsJSON = JSON.stringify(products); // lo pasamos a JSON
  // fs.writeFileSync(productsFilePath, productsJSON); //escribimos la nueva DB
};
module.exports = productsController;
