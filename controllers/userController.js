const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const e = require("cors");
const nodemailer = require("nodemailer");

// user
// lấy thông tin người dùng
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("getMe called with userId:", req.user.id);
    const user = await User.findById(userId)
      .select("-password -otpCode -otpExpiresAt -status");

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getUserById = async(req, res) =>{
  try{
    const {id} = req.params;
    const user = await User.findById(id)
      .select("-password -otpCode -otpExpiresAt")

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    return res.status(200).json({
      message: "Lấy thông tin người dùng thành công",
      data: user
    });

  }catch(error){
    res.status(500).json({message:"Lỗi server", error:error.message})
  }
}
// đổi mật khẩu 
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .select("+password"); // cần lấy cả password

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({ message: "Mật khẩu mới không được giống mật khẩu cũ" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Xác nhận mật khẩu mới không khớp" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Đổi mật khẩu thành công" });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// chỉnh sửa thông tin 
exports.changeInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, address, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          name: name,
          address: address,
          phone: phone
        }
      },
      { new: true, select: "-otpCode -status -otpExpiresAt" }
    );

    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    return res.status(200).json({
      message: "Đổi thông tin người dùng thành công",
      data: {
        name: user.name,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// quên mật khẩu 
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Email không tồn tại" });

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

    return res.status(200).json({ message: "Vui lòng kiểm tra Gmail để nhận mật khẩu mới" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// admin
// lấy tất cả người dùng, phân trang
exports.getAllUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
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

    return res.status(200).json({
      message: "Lấy danh sách người dùng thành công",
      data: {
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
        users
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// chỉnh sửa người dùng
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address, status, role } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name: name,
          phone: phone,
          address: address,
          role: role,
          status: status
        }
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    return res.status(200).json({
      message: "Cập nhật thông tin người dùng thành công",
      data: {
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
