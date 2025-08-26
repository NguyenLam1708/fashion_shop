const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: String,          
      price: Number,         
      quantity: { type: Number, min: 1, required: true }
    }
  ],
  totalAmount: { type: Number, min: 0, required: true },
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, enum: ["COD", "VNPAY"], required: true },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed", "unpaid"], default: "pending" },
  status: { type: String, enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"], default: "pending" },
  orderCode: { type: String, index: true }, // mã giao dịch liên kết cổng thanh toán
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
