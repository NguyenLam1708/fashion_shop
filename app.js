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
  origin: 'http://localhost:3000', // ⚠️ khi dev frontend thường chạy port 8080
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// truy cập file tĩnh (ảnh upload)
app.use('/uploads', express.static(path.join(__dirname,'uploads')));

app.use(express.json());

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);

// ⚡ Thêm đoạn này để phục vụ frontend Vue build
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// với mọi route không phải API → trả về index.html cho Vue router xử lý
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Kết nối DB và chạy server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Database connection failed:', err);
});
