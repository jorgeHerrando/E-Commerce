const path = require("path");
const { validationResult } = require("express-validator");

const db = require("../database/models");

module.exports = {
  addCart: (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (errors.isEmpty()) {
      //Debemos buscar el producto por el id
      db.Product.findByPk(Number(req.body.productId), {
        include: ["images", "sizes", "brand", "category"],
      }).then((product) => {
        //return res.send( typeof productos.discount)
        let price =
          product.discount > 0
            ? Number(product.price) * ((100 - product.discount) / 100)
            : Number(product.price);

        //console.log(price +"==================================")
        //Crear mi items
        return db.Item.create({
          salePrice: price,
          quantity: req.body.amount,
          subtotal: req.body.amount * price,
          state: 1,
          user_id: req.session.userLogged.id,
          product_id: product.id,
          cart_id: null,
        })
          .then((item) => res.redirect("/products"))
          .catch((error) => console.log(error));
      });
    } else {
      db.Product.findByPk(req.body.productId, {
        include: ["images", "sizes", "brand", "category"],
      }).then((product) => {
        res.render(
          path.resolve(__dirname, "..", "views", "products", "productDetail"),
          { detailProduct: product, errors: errors.mapped() }
        );
      });
    }
  },
  cart: (req, res) => {
    console.log("aqui llegue");
    db.Item.findAll({
      where: {
        state: 1,
        user_id: req.session.userLogged.id,
      },
      include: [
        {
          as: "product",
          model: db.Product,
          include: ["images", "sizes", "brand", "category"],
          // nested: true,
        },
        {
          as: "cart",
          model: db.Cart,
          nested: true,
        },
        {
          as: "user",
          model: db.User,
          nested: true,
        },
      ],
    }).then((items) => {
      const filter = items.map((item) => {
        return item.product_id;
      });
      const onlyIds = [...new Set(filter)];

      const itemsToView = [];

      onlyIds.forEach((id) => {
        const productsSameId = items.filter((item) => item.product_id === id);
        const total = productsSameId.reduce(
          (total, item) => total + item.quantity,
          0
        );
        productsSameId.forEach((product) => (product.quantity = total));
        itemsToView.push(productsSameId[0]);
      });

      let total = items.reduce(
        (total, item) => (total = total + Number(item.subtotal)),
        0
      );

      res.render(
        path.resolve(__dirname, "..", "views", "products", "productCart"),
        {
          cartProduct: itemsToView,
          total,
        }
      );
    });
  },
  deleteCart: (req, res) => {
    db.Item.destroy({
      where: {
        product_id: req.body.itemId,
        user_id: req.session.userLogged.id,
      },
    })
      .then(() => res.redirect("/cart/cartDetail"))
      .catch((error) => console.log(error));
  },
  checkout: (req, res) => {
    let totalPrice = 0;
    db.Item.findAll({
      where: {
        user_id: req.session.userLogged.id,
        state: 1,
      },
    }).then((items) => {
      totalPrice = items.reduce(
        (total, item) => (total = total + Number(item.subtotal)),
        0
      );
    });
    db.Cart.findOne({
      order: [["createdAt", "DESC"]],
    })
      .then((cart) => {
        return db.Cart.create({
          orderNumber: cart ? cart.orderNumber + 1 : 1,
          total: totalPrice,
          user_id: req.session.userLogged.id,
        });
      })
      .then((cart) => {
        db.Item.update(
          {
            state: 0,
            cart_id: cart.id,
          },
          {
            where: {
              user_id: req.session.userLogged.id,
              state: 1,
            },
          }
        );
      })
      .then(() => res.redirect(`/users/profile/orders`))
      .catch((error) => console.log(error));
  },
  history: (req, res) => {
    db.Cart.findAll({
      where: {
        user_id: req.session.userLogged.id,
      },
      include: {
        all: true,
        nested: true,
      },
    }).then((carts) => {
      res.render(path.resolve(__dirname, "..", "views", "users", "orders"), {
        carts,
      });
    });
  },
  buyDetail: (req, res) => {
    db.Cart.findByPk(req.params.id, {
      include: {
        as: "user",
        model: db.User,
        // nested: true,
      },
      include: {
        as: "items",
        model: db.Item,
        include: ["product", "user"],
        // nested: true,
      },
    }).then((cart) => {
      res.render(
        path.resolve(__dirname, "..", "views", "users", "orderDetail"),
        { cart }
      );
    });
  },
};
