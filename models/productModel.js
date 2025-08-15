const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tên sản phẩm không được bỏ trống"],
    trim: true,
    maxlength: 255
  },
  description: String,
  price: {
    type: Number,
    required: [true, "Giá không được bỏ trống"],
    min: [0, "Giá phải lớn hơn hoặc bằng 0"]
  },
  quantity: {
    type: Number,
    default: 0,
    min: [0, "Số lượng không được âm"]
  },
  imageUrls: {
    type: String,
    match: [/^https?:\/\/.+/, "URL hình ảnh không hợp lệ"]
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  size: {
    type: String,
    maxlength: 10
  },
  color: {
    type: String,
    maxlength: 50
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Product", productSchema);
