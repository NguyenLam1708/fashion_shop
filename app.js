const express = require('express');
const authRoutes = require('./routes/authRoutes');
const sequelize = require("../backend/config/db");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

//Routes
app.use('/api/v1/auth', authRoutes);

//kết nối DB và chạy server
sequelize.sync().then(() => {
    console.log("Database connected");
    app.listen(PORT,() => console.log('Server running on port ' + PORT));
}).catch(err =>{
    console.error("Không thể kết nối database",err);

});

