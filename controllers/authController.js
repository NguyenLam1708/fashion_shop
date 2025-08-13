const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");
require("dotenv").config();

exports.register = async(req, res) => {
    try {
        const { name, email, password, address, phone} = req.body;

        const existing = await User.findOne({where : { email } });
        if (existing){
            return res.status(400).json({message: "Email đã tồn tại"});
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            address,
            phone,
            otpCode,
            otpExpiresAt,
            role: 'user',
            status: 'pending'
        });

        //gửi mail
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject:"Xác thực tài khoản fashion_shop",
            text:`Mã OTP của bạn là : ${otpCode}. Hết hạn sau 10 phút`
        });

        res.status(200).json({message: "Đăng ký thành công", data:{userId: user.id}});
    } catch(err) {
        res.status(500).json({message: "Lỗi server", error: err.message});
    
    }
};

exports.verifyOtp = async (req,res) =>{
    try{
        const {email, otpCode} = req.body;
        const user = await User.findOne({where:{email}});
        
        if(!user) return res.status(404).json({message:"Email không tồn tại"});
        if(user.status == "active") return res.status(400).json({message:"Tài khoản đã được kích hoạt"});
        if(user.otpCode !== otpCode) return res.status(400).json({message:"OTP không đúng"});
        if (new Date() > user.otpExpiresAt) return res.status(400).json({ message: "OTP đã hết hạn" });

        user.status = "active";
        await user.save();
        res.status(200).json({ message: "Xác thực thành công, tài khoản đã kích hoạt" });
    }catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Người dùng không tồn tại" });
    if (user.status === "active") return res.status(400).json({ message: "Tài khoản đã kích hoạt" });

    // Tạo OTP mới
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // hết hạn sau 10 phút

    // Cập nhật vào DB
    user.otpCode = otpCode;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Gửi email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "OTP xác thực tài khoản mới",
      text: `Mã OTP mới của bạn là: ${otpCode}. Hết hạn sau 10 phút.`
    });

    res.status(200).json({ message: "OTP mới đã được gửi đến email" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};


exports.login = async(req,res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({where: { email } });
        
        if(!user){
            return res.status(400).json({message: "Email không tồn tại"});
        }

        if (user.status !== "active") return res.status(400).json({ message: "Tài khoản chưa kích hoạt" });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Mật khẩu không đúng"});
        }

        const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
        );

    res.status(200).json({ message: "Đăng nhập thành công", data:{userId: user.id, token }});
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};