const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Số lượng phải >= 1"]
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Giá phải >= 0"]
  }
});

module.exports = mongoose.model("OrderItem", orderItemSchema);
