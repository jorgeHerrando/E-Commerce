module.exports = (sequelize, dataTypes) => {
  let alias = "Subcategory";

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
  };

  let config = {
    tableName: "subcategories",
    timestamps: true,
    deletedAt: false,
  };

  const Subcategory = sequelize.define(alias, cols, config);

  Subcategory.associate = (models) => {
    // Products
    Subcategory.hasMany(models.Product, {
      as: "products",
      foreignKey: "subcategory_id",
    });
  };

  return Subcategory;
};
