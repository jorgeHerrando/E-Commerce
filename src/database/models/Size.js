module.exports = (sequelize, dataTypes) => {
    let alias = "Size";
  
    let cols = {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: dataTypes.STRING,
      },
    };
  
    let config = {
      tableName: "sizes",
      timestamps: true,
      deletedAt: false,
    };
  
    const Size = sequelize.define(alias, cols, config);
  
    Size.associate = (models) => {
      // Products
      Size.belongsToMany(models.Product, {
        as: "products",
        through: "product_size",
        foreignKey: "size_id",
        otherKey: "product_id",
        timestamps: false,
      });

      // Stocks
      Size.hasMany(models.Stock, {
        as: "stocks",
        foreignKey: "size_id",
      });
    };
  
    return Size;
  };
  