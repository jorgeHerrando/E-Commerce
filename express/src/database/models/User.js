module.exports = (sequelize, dataTypes) => {
  let alias = "User";

  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    firstName: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // CHEQUEAR
    password: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  };

  let config = {
    tableName: "users",
    timestamps: true,
  };

  const User = sequelize.define(alias, cols, config);

  User.associate = (models) => {
    // Roles
    User.belongsTo(models.Role, {
      as: "role",
      foreignKey: "role_id",
    });
    // User Images
    User.belongsTo(models.UserImage, {
      as: "image",
      foreignKey: "image_id",
    });

    // Addresses
    User.hasOne(models.Address, {
      as: "address",
      foreignKey: "user_id",
    });

    // Orders
    User.hasMany(models.Order, {
      as: "orders",
      foreignKey: "user_id",
    });
  };

  return User;
};
