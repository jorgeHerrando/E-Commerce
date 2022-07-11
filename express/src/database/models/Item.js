module.exports = (sequelize, dataTypes) => {
  let alias = "Item";

  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    salePrice: {
      type: dataTypes.DECIMAL,
      allowNull: false,
    },

    quantity: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },

    subtotal: {
      type: dataTypes.DECIMAL,
      allowNull: false,
    },

    state: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
  };

  let config = {
    tableName: "items",
    timestamps: true,
  };

  const Item = sequelize.define(alias, cols, config);
  Item.associate = (models) => {
    Item.belongsTo(models.Cart, {
      as: "cart",
      foreignKey: "cart_id",
    });

    Item.belongsTo(models.User, {
      as: "user",
      foreignKey: "user_id",
    });

    Item.belongsTo(models.Product, {
      as: "product",
      foreignKey: "product_id",
    });
  };
  return Item;
};
