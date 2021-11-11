module.exports = (sequelize, dataTypes) => {
    let alias = "Role";
  
    let cols = {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      role: {
        type: dataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    };
  
    let config = {
      tableName: "roles",
      timestamps: true,
      deletedAt: false,
    };
  
    const Role = sequelize.define(alias, cols, config);
  
    Role.associate = (models) => {
      // Users
      Role.hasMany(models.User, {
        as: "users",
        foreignKey: "role_id",
      });
    };
  
    return Role;
  };