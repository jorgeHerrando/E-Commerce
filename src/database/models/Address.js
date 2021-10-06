module.exports = (sequelize, dataTypes) => {
  let alias = "Address";

  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    streetName: {
      type: dataTypes.STRING,
    },
    number: {
      type: dataTypes.INTEGER,
    },
    apartment: {
      type: dataTypes.STRING,
    },
    province: {
      type: dataTypes.STRING,
    },
    city: {
      type: dataTypes.STRING,
    },
    postalCode: {
      type: dataTypes.INTEGER,
    },
    country: {
      type: dataTypes.STRING,
    },
  };

  let config = {
    tableName: "addresses",
    timestamps: true,
    deletedAt: false,
  };

  const Address = sequelize.define(alias, cols, config);

  Address.associate = (models) => {
    // Users
    Address.belongsTo(models.User, {
      as: "user",
      foreignKey: "user_id",
    });
    // Orders
    Address.hasMany(models.Order, {
      as: "orders",
      foreignKey: "address_id",
    });
  };

  return Address;
};
