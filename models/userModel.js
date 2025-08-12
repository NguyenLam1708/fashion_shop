const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize. define("User",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: { 
        type:DataTypes.STRING, 
        allowNull:false
    },
    email:{ 
        type:DataTypes.STRING, 
        allowNull:false, 
        unique:true
    },
    password:{ 
        type:DataTypes.STRING, 
        allowNull:false
    },
    address:{
        type:DataTypes.STRING
    },
    phone:{
        type:DataTypes.STRING
    },
    status:{
        type: DataTypes.ENUM("pending","active","banned"),
        defaultValue:"pending"
    },
    otpCode:{
        type : DataTypes.STRING
    },
    otpExpiresAt:{
        type: DataTypes.DATE
    },
    role:{
        type: DataTypes.ENUM("user", "admin"), 
        allowNull: false, 
        defaultValue: "user"
    },
    createdAt:{
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW
    }
},{
    tableName: "users",
    timestamps: false,
    underscored: true
})

module.exports = User;