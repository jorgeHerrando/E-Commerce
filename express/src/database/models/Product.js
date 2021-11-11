module.exports = (sequelize, dataTypes) => {
  let alias = "Product";

  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: dataTypes.TEXT,
    },
    price: {
      type: dataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount: {
      type: dataTypes.DECIMAL,
    },
    sale: {
      // 1 on sale, 0 not on sale
      type: dataTypes.INTEGER,
      allowNull: false,
    },
  };

  let config = {
    tableName: "products",
    timestamps: true,
  };

  const Product = sequelize.define(alias, cols, config);

  Product.associate = (models) => {
    // Categories
    Product.belongsTo(models.Category, {
      as: "category",
      foreignKey: "category_id",
    });
    // Subcategories
    Product.belongsTo(models.Subcategory, {
      as: "subcategory",
      foreignKey: "subcategory_id",
    });
    // Brands
    Product.belongsTo(models.Brand, {
      as: "brand",
      foreignKey: "brand_id",
    });

    // Tags
    Product.belongsToMany(models.Tag, {
      as: "tags",
      through: "product_tag",
      foreignKey: "product_id",
      otherKey: "tag_id",
      timestamps: false,
    });
    // Sizes
    Product.belongsToMany(models.Size, {
      as: "sizes",
      through: "product_size",
      foreignKey: "product_id",
      otherKey: "size_id",
      timestamps: false,
    });

    // ProductImages
    Product.hasMany(models.ProductImage, {
      as: "images",
      foreignKey: "product_id",
    });
    // Stocks
    Product.hasMany(models.Stock, {
      as: "stocks",
      foreignKey: "product_id",
    });
    // Order Details
    Product.hasMany(models.OrderDetail, {
      as: "orderDetails",
      foreignKey: "order_id",
    });
  };

  return Product;
};
