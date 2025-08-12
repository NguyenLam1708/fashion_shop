const {DataTypes} = require("sequelize")
const sequelize = require("../config/db");

const Category = sequelize.define("Category",{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull:false,
        unique: true
    },
    createdAt:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},{
    tableName:"categories",
    timestamps:false,
    underscored:true
})

module.exports = Category;