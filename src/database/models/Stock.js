module.exports = (sequelize, dataTypes) => {
    let alias = "Stock";
  
    let cols = {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      amount: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
    };
  
    let config = {
      tableName: "stocks",
      timestamps: true,
      deletedAt: false,
    };
  
    const Stock = sequelize.define(alias, cols, config);
  
    Stock.associate = (models) => {
      // Products
      Stock.belongsTo(models.Product, {
        as: "product",
        foreignKey: "product_id",
      });
      // Sizes
      Stock.belongsTo(models.Size, {
        as: "size",
        foreignKey: "size_id",
      });
    };
  
    return Stock;
  };