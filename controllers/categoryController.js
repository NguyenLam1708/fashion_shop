const categoryService = require("../services/categoryService");

class CategoryController {
  async createCategory(req, res) {
    try {
      const newCategory = await categoryService.createCategory(req.body.name);
      return res.status(201).json({
        message: "Tạo category thành công",
        data: newCategory
      });
    } catch (error) {
      console.error(error);
      return res.status(error.status || 500).json({
        message: error.message || "Lỗi server"
      });
    }
  }

  async getAllCategories(req, res) {
    try {
      const data = await categoryService.getAllCategories(req.query.page, req.query.limit);
      return res.status(200).json({
        message: "Lấy danh sách category thành công",
        data
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }

  async updateCategory(req, res) {
    try {
      const category = await categoryService.updateCategory(req.params.categoryId, req.body.name);
      return res.status(200).json({
        message: "Cập nhật category thành công",
        data: category
      });
    } catch (error) {
      console.error(error);
      return res.status(error.status || 500).json({ message: error.message });
    }
  }

  async deleteCategory(req, res) {
    try {
      await categoryService.deleteCategory(req.params.categoryId);
      return res.status(200).json({ message: "Xóa category thành công" });
    } catch (error) {
      console.error(error);
      return res.status(error.status || 500).json({ message: error.message });
    }
  }
}

module.exports = new CategoryController();
