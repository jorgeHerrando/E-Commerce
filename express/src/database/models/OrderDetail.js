module.exports = (sequelize, dataTypes) => {
    let alias = "OrderDetail";
  
    let cols = {
      id: {
        type: dataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      amount: {
        type: dataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      price: {
        type: dataTypes.DECIMAL(10,2),
        allowNull: false,
      },
    };
  
    let config = {
      tableName: "order_details",
      timestamps: true,
      deletedAt: false,
    };
  
    const OrderDetail = sequelize.define(alias, cols, config);
  
    OrderDetail.associate = (models) => {
      // Orders
      OrderDetail.belongsTo(models.Order, {
        as: "order",
        foreignKey: "order_id",
      });
      // Products
      OrderDetail.belongsTo(models.Product, {
        as: "product",
        foreignKey: "product_id",
      });
    };
  
    return OrderDetail;
  };