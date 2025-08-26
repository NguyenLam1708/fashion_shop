const authService = require("../services/authService");

class AuthController {
  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({ message: "Đăng ký thành công vui lòng vô gmail để xác nhận OTP", data: result });
    } catch (err) {
      res.status(err.statusCode || 400).json({ message: err.message });
    }
  }

  async verifyOtp(req, res) {
    try {
      await authService.verifyOtp(req.body);
      res.status(200).json({ message: "Xác thực thành công, tài khoản đã kích hoạt" });
    } catch (err) {
      res.status(err.statusCode || 400).json({ message: err.message });
    }
  }

  async resendOtp(req, res) {
    try {
      await authService.resendOtp(req.body);
      res.status(200).json({ message: "OTP mới đã được gửi đến email" });
    } catch (err) {
      res.status(err.statusCode || 400).json({ message: err.message });
    }
  }

  async login(req, res) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({
        message: "Đăng nhập thành công",
        data: {
          token: result.token,
          userId: result.userId,
        }
      });
    } catch (err) {
      res.status(err.statusCode || 400).json({ message: err.message });
    }
  }
}

module.exports = new AuthController();
