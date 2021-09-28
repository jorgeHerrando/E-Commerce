module.exports = (sequelize, dataTypes) => {
    let alias = "ProductImage";

    let cols = {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: dataTypes.STRING,
        unique: true,
        allowNull: false
      }
    };

    let config = {
      tableName: "productImages",
      timestamps: true,
      deletedAt: false
    };

    const ProductImage = sequelize.define(alias, cols, config);
  
    ProductImage.associate = (models) => {
      // Products
      ProductImage.belongsTo(models.Product, {
        as: "product",
        foreignKey: "product_id",
      });
    };
  
    return ProductImage;
  };