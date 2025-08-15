const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tên không được bỏ trống"],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, "Email không được bỏ trống"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"]
  },
  password: {
    type: String,
    required: [true, "Mật khẩu không được bỏ trống"],
    minlength: 6
  },
  phone: {
    type: String,
    match: [/^[0-9]{9,15}$/, "Số điện thoại không hợp lệ"]
  },
  address: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  status: {
    type: String,
    enum: ["pending", "active", "banned"],
    default: "pending"
  },
  otpCode: String,
  otpExpiresAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
