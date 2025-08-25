const express = require('express');
const cors = require('cors');
const authRoutes = require('../backend/routes/authRoutes');
const userRoutes = require('../backend/routes/userRoutes');
const productRoutes = require('../backend/routes/productRoutes');
const categoryRoutes = require('../backend/routes/categoryRoutes');
const cartRoutes = require('../backend/routes/cartRoutes');
const connectDB = require("./config/db");
const path = require('path');
const PORT = process.env.PORT || 3000;

const app = express();

// // Cấu hình CORS
app.use(cors({
  origin: 'http://localhost:3000', // domain frontend của bạn
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // nếu muốn gửi cookie/token qua CORS
}));

//truy cập file tĩnh
app.use('/uploads', express.static(path.join(__dirname,'uploads')));

app.use(express.json());

//Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);

//kết nối DB và chạy server
// ====== Khởi động server ======
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Database connection failed:', err);
});


