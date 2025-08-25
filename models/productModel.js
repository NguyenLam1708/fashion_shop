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
  imageUrl: {
    type: [String],
    default: []   // để nếu không có ảnh vẫn lưu []
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
// Ngăn trùng sản phẩm theo name + size + color
productSchema.index({ name: 1, size: 1, color: 1 }, { unique: true });

module.exports = mongoose.model("Product", productSchema);
