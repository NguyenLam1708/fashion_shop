const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

class UserService {
  async getMe(userId) {
    return await User.findById(userId).select("-password -otpCode -otpExpiresAt -status");
  }

  async getUserById(id) {
    return await User.findById(id).select("-password -otpCode -otpExpiresAt");
  }

  async changePassword(userId, oldPassword, newPassword, confirmPassword) {
    const user = await User.findById(userId).select("+password");
    if (!user) throw new Error("Người dùng không tồn tại");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Mật khẩu cũ không đúng");
    if (oldPassword === newPassword) throw new Error("Mật khẩu mới không được giống mật khẩu cũ");
    if (newPassword !== confirmPassword) throw new Error("Xác nhận mật khẩu mới không khớp");

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return true;
  }

  async changeInfo(userId, { name, address, phone }) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { name, address, phone } },
      { new: true, select: "-otpCode -status -otpExpiresAt -password -role" }
    );
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Email không tồn tại");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const newPassword = Math.random().toString(36).slice(-6);
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Fashion_shop gửi bạn mật khẩu mới",
      text: `Mật khẩu mới của bạn là: ${newPassword}`
    });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return true;
  }

  async getAllUsers(page = 1, limit = 10) {
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find({ role: { $ne: "admin" } })
        .select("id name email role phone address status createdAt")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments({ role: { $ne: "admin" } })
    ]);

    return {
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      users
    };
  }

  async updateUser(id, { name, phone, address, status, role }) {
    return await User.findByIdAndUpdate(
      id,
      { $set: { name, phone, address, role, status } },
      { new: true }
      
    );
  }
}

module.exports = new UserService();
