const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CartItem = sequelize.define("CartItem", {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true },
    cartId: {
        type: DataTypes.INTEGER,
        references: { 
            model: "carts",
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
        allowNull: false, 
        defaultValue: 1 
    },
    addedAt: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    }
}, {
    tableName: "cart_items",
    timestamps: false,
    underscored: true
});

module.exports = CartItem;
