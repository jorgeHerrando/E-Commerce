module.exports = (sequelize, dataTypes) => {
  let alias = "Brand";

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
      allowNull: false,
    },
  };
  let config = {
    tableName: "brands",
    timestamps: true,
    deletedAt: false,
  };

  const Brand = sequelize.define(alias, cols, config);

  Brand.associate = (models) => {
    // Products
    Brand.hasMany(models.Product, {
      as: "products",
      foreignKey: "brand_id",
    });
  };

  return Brand;
};
