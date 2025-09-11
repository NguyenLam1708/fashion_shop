const userService = require("../services/userService");

class UserController {
  async getMe(req, res) {
    try {
      const user = await userService.getMe(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;
      await userService.changePassword(req.user.id, oldPassword, newPassword, confirmPassword);
      res.status(200).json({ message: "Đổi mật khẩu thành công" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async changeInfo(req, res) {
    try {
      const user = await userService.changeInfo(req.user.id, req.body);
      if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });
      res.status(200).json({ message: "Cập nhật thông tin thành công", data: user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async forgotPassword(req, res) {
    try {
      await userService.forgotPassword(req.body.email);
      res.status(200).json({ message: "Vui lòng kiểm tra email để nhận mật khẩu mới" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const { page, limit } = req.query;
      const data = await userService.getAllUsers(page, limit);
      res.status(200).json({ message: "Lấy danh sách thành công", data });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async updateUser(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });
      res.status(200).json({ 
        message: "Cập nhật thành công", 
        data: {      
          userId: user.id,  
          name: user.name,
          phone: user.phone,
          address: user.address,
          role: user.role,
        }
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  
  async banUser(req, res) {
    try {
      const user = await userService.banUser(req.params.id);
      if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });
      res.status(200).json({ message: "Người dùng đã bị cấm", data: { status: user.status } });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async activeUser(req, res) {
    try {
      const user = await userService.activeUser(req.params.id);
      if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });
      res.status(200).json({ message: "Người dùng đã được mở khóa", data: { status: user.status } });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new UserController();
