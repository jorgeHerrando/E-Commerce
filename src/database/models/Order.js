module.exports = (sequelize, dataTypes) => {
    let alias = "Order";
  
    let cols = {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      totalPrice: {
        type: dataTypes.DECIMAL(10,2),
        allowNull: false,
      },
    };
  
    let config = {
      tableName: "orders",
      timestamps: true,
      deletedAt: false,
    };
  
    const Order = sequelize.define(alias, cols, config);
  
    Order.associate = (models) => {
      // Users
      Order.belongsTo(models.User, {
        as: "user",
        foreignKey: "user_id",
      });
      // Addresses
      Order.belongsTo(models.Address, {
        as: "address",
        foreignKey: "address_id",
      });
      // Payment Methods
      Order.belongsTo(models.PaymentMethod, {
        as: "paymentMethod",
        foreignKey: "method_id",
      });

      // Order Detail
      Order.hasMany(models.OrderDetail, {
        as: "orderDetails",
        foreignKey: "order_id",
      });
    };
  
    return Order;
  };