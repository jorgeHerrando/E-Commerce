module.exports = (sequelize, dataTypes) => {
  let alias = "Cart";

  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    orderNumber: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },

    total: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
  };

  let config = {
    tableName: "carts",
    timestamps: true,
  };

  let Cart = sequelize.define(alias, cols, config);

  Cart.associate = (models) => {
    Cart.hasMany(models.Item, {
      as: "items",
      foreignKey: "cart_id",
    });
    Cart.belongsTo(models.User, {
      as: "user",
      foreignKey: "user_id",
    });
  };

  return Cart;
};
