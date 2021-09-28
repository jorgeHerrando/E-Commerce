module.exports = (sequelize, dataTypes) => {
    let alias = "PaymentMethod";
  
    let cols = {
      id: {
        type: dataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      method: {
        type: dataTypes.STRING,
        allowNull: false,
      },
    };
  
    let config = {
      tableName: "paymentMethods",
      timestamps: true,
      deletedAt: false,
    };
  
    const PaymentMethod = sequelize.define(alias, cols, config);
  
    PaymentMethod.associate = (models) => {
      // Orders
      PaymentMethod.hasMany(models.Order, {
        as: "orders",
        foreignKey: "method_id",
      });
    };
  
    return PaymentMethod;
  };