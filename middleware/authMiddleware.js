const jwt = require("jsonwebtoken");
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const header = req.header('Authorization') || req.header("authorization");
    if(!header || !header.startsWith('Bearer ')){
        return res.status(401).json({message:"Không có token"});
    }

    const token = header.split(' ')[1];
    try {
        const decoded = jwt .verify(token,JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (err) {
        return res.status(401).json({message: 'Token không hợp lệ'});
    }
};