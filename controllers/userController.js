const User = require("../models/userModel");
const bcrypt = require("bcrypt");

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
exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['otpCode', 'otpExpiresAt', 'status'] }
        });

        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        const { oldPassword, newPassword, confirmPassword } = req.body;

        // Kiểm tra mật khẩu cũ đúng hay không
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
        }

        // Kiểm tra mật khẩu mới không được giống mật khẩu cũ
        if (oldPassword === newPassword) {
            return res.status(400).json({ message: "Mật khẩu mới không được giống mật khẩu cũ" });
        }

        // Kiểm tra mật khẩu mới và confirmPassword phải trùng nhau
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Xác nhận mật khẩu mới không khớp" });
        }

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu
        await user.update({ password: hashedPassword });

        return res.status(200).json({ message: "Đổi mật khẩu thành công" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};

// chỉnh sửa thông tin 
exports.changeInfo = async (req,res) =>{
    try{
        const userId = req.user.id;
        const user = await User.findByPk(userId,{
            attributes:{exclude:['otpCode','status','otpExpiresAt']}
        });
        if(!user) return res.status(404).json({message:"Người dùng không tồn tại"});

        const { name, address, phone} = req.body;
        User.update({
            name: name || user.name,
            address: address || user.address,
            phone: phone || user.phone
        },
        { where: { id: userId }}
        );

        return res.status(200).json({
            message: "Đổi thông tin người dùng thành công",
            data: {
                name: user.name,
                phone: user.phone,
                address: user.address
            }
        });
    } catch (error){
        console.error(error);
        return res.status(500).json({message:"Lỗi server", error: error.message})
    };
};
// quên mật khẩu 

//admin
// lấy tất cả người dùng, phân trang 
// ban người dùng