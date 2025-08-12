const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const OrderItem = sequelize.define("OrderItem", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        references: {
            model: "orders", 
            key: "id"
        },
        onDelete: "CASCADE"
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: "products", 
            key: "id"
        },
        onDelete: "CASCADE"
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: "order_items", 
    underscored: true
});

module.exports = OrderItem;
