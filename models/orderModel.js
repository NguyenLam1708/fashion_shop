const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define("Order",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    userId:{
        type: DataTypes.INTEGER,
        references:{
            model:"users",
            key:"id"
        },
        onDelete:"CASCADE"
    },
    totalAmount:{
        type: DataTypes.DECIMAL(10,2),
        allowNull:false
    },
    shippingAddress:{
        type: DataTypes.TEXT,
        allowNull: false
    },
        status:{
        type: DataTypes.ENUM("pending", "confirmed","shipped", "delivered", "cancelled"),
        defaultValue:"pending"
    },
    orderDate:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},{
    tableName:"orders",
    timestamps:false,
    underscored:true
})

module.exports = Order;
