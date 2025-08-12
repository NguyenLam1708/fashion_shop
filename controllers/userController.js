const User = require("../models/userModel");

//user
// lấy thông tin người dùng
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id; 

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password','otpCode','otpExpiresAt','status'] } 
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// đổi mật khẩu 
// chỉnh sửa thông tin 
// quên mật khẩu 

//admin
// lấy tất cả người dùng, phân trang 
// ban người dùng