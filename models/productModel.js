const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define("Product",{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    quantity:{
        type:DataTypes.INTEGER,
        defaultValue: 0

    },
    imageUrl:{
        type:DataTypes.STRING
    },
    categoryId:{
        type: DataTypes.INTEGER,
        references:{
            model: "categories",
            key: "id"
        },
        onDelete:"CASCADE"
    },
    size:{
        type: DataTypes.STRING
    },
    color:{
        type: DataTypes.STRING
    },
    createdAt:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},{
    tableName:"products",
    timestamps: false,
    underscored: true
})

module.exports = Product;