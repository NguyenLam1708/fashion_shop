const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Cart = sequelize.define("Cart", {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    userId: {
        type: DataTypes.INTEGER,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE"
    },
    createdAt: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    }
}, {
    tableName: "carts",
    timestamps: false,
    underscored: true
});

module.exports = Cart;
