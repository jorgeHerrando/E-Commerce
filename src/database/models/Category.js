module.exports = (sequelize, dataTypes) => {
  let alias = "Category";

  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: dataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    image: {
      type: dataTypes.STRING,
    },
  };

  let config = {
    tableName: "categories",
    timestamps: true,
    deletedAt: false,
  };

  const Category = sequelize.define(alias, cols, config);

  Category.associate = (models) => {
    // Products
    Category.hasMany(models.Product, {
      as: "products",
      foreignKey: "category_id",
    });
  };

  return Category;
};
