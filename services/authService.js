const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const {sendMail} = require("../utils/mailer")
require("dotenv").config();

class AuthService {

  async register({ name, email, password, address, phone }) {
    const existing = await User.findOne({ email });
    if (existing) throw new Error("Email đã tồn tại");

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
      otpCode,
      otpExpiresAt,
      role: "user",
      status: "pending"
    });

    await sendMail(
      email,
      "Xác thực tài khoản fashion_shop",
      `Mã OTP của bạn là: ${otpCode}. Hết hạn sau 10 phút`
    );
    return { userId: user._id };
  }

  async verifyOtp({ email, otpCode }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Email không tồn tại");
    if (user.status === "active") throw new Error("Tài khoản đã được kích hoạt");
    if (user.otpCode !== otpCode) throw new Error("OTP không đúng");
    if (new Date() > user.otpExpiresAt) throw new Error("OTP đã hết hạn");

    user.status = "active";
    user.otpCode = null;
    user.otpExpiresAt = null;
    await user.save();

    return true;
  }

  async resendOtp({ email }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Người dùng không tồn tại");
    if (user.status === "active") throw new Error("Tài khoản đã kích hoạt");

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otpCode = otpCode;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await sendMail(
      email,
      "OTP xác thực tài khoản mới",
      `Mã OTP mới của bạn là: ${otpCode}. Hết hạn sau 10 phút.`
    );

    return true;
  }

  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Email không tồn tại");
    if (user.status === "pending") throw new Error("Tài khoản chưa kích hoạt");
    if (user.status === "banned") throw new Error("Tài khoản đã bị ban");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Mật khẩu không đúng");

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return { userId: user._id, token };
  }
}

module.exports = new AuthService();
