module.exports = (sequelize, dataTypes) => {
    let alias = "Address";
  
    let cols = {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      streetName: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      number: {
        type: dataTypes.INTEGER,
      },
      province: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      postalCode: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      country: {
        type: dataTypes.STRING,
        allowNull: false,
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