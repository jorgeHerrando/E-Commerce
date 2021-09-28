module.exports = (sequelize, dataTypes) => {
  let alias = "Tag";

  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  };

  let config = {
    tableName: "tags",
    timestamps: true,
    deletedAt: false,
  };

  const Tag = sequelize.define(alias, cols, config);

  Tag.associate = (models) => {
    // Products
    Tag.belongsToMany(models.Product, {
      as: "products",
      through: "product_tag",
      foreignKey: "tag_id",
      otherKey: "product_id",
      timestamps: false,
    });
  };

  return Tag;
};
