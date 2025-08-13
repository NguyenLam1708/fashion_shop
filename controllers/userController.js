const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
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
        user.update({
            name: name || user.name,
            address: address || user.address,
            phone: phone || user.phone
        });

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
exports.forgotPassword = async(req,res)=>{
    try{
        const {email} =  req.body;
        const user = await User.findOne({where:{email}});
        if(!user) return res.status(404).json({message:"Email không tồn tại"});

        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })
        const newPassword = Math.random().toString(36).slice(-6);
        await transporter.sendMail(
            {
                from: process.env.MAIL_USER,
                to:email,
                subject:"Fashion_shop gửi bạn mật khẩu mới",
                text:`Mật khẩu mới của bạn là: ${newPassword}`
            }
        )
        const hashedPassword = await bcrypt.hash(newPassword,10);
        user.update({
            password: hashedPassword
            }
        );
        return res.status(200).json({message:"Vui lòng kiểm tra Gmail để nhận mật khẩu mới"})
    }catch(error){
        console.error(error)
        return res.status(500).json({message:"Lỗi server",error: error.message})
    }
};
//admin
// lấy tất cả người dùng, phân trang
exports.getAllUsers = async (req,res) =>{
    try{
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        //Tính offset
        const offset = (page-1) * limit;

        const {count, rows} = await User.findAndCountAll({
            attributes:["id","name","email","role","phone","address","status","createdAt"],
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            where: { role: { [Op.ne]: "admin" } }, // Op = not equal
        })
         // Trả về kết quả
        return res.status(200).json({
            message: "Lấy danh sách người dùng thành công",
            data: {
                totalUsers: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                users: rows
            }
        });
    }catch(error){
        console.error(error)
        res.status(500).json({message:"Lỗi server",error: error.message})
    }
} 
// chỉnh sửa người dùng
// ban người dùng