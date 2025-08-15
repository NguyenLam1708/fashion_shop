const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: [1, "Số lượng phải lớn hơn 0"]
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("CartItem", cartItemSchema);
