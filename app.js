const express = require('express');
const cors = require('cors');
const authRoutes = require('../backend/routes/authRoutes');
const userRoutes = require('../backend/routes/userRoutes');
const sequelize = require("../backend/config/db");
const PORT = process.env.PORT || 3000;

const app = express();

// // Cấu hình CORS
app.use(cors({
  origin: 'http://localhost:3000', // domain frontend của bạn
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // nếu muốn gửi cookie/token qua CORS
}));

app.use(express.json());

//Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

//kết nối DB và chạy server
sequelize.sync().then(() => {
    console.log("Database connected");
    app.listen(PORT,() => console.log('Server running on port ' + PORT));
}).catch(err =>{
    console.error("Không thể kết nối database",err);

});

