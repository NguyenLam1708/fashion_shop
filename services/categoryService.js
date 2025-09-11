const Category = require("../models/categoryModel");
const Product = require("../models/productModel");

class CategoryService {
  // Tạo category mới
  async createCategory(name) {
    if (!name || name.trim() === "") {
      throw { status: 400, message: "Tên category không được bỏ trống" };
    }

    const existing = await Category.findOne({ name: name.trim(), isDeleted: false });
    if (existing) {
      throw { status: 400, message: "Category đã tồn tại" };
    }

    return await Category.create({ name: name.trim() });
  }

  // Lấy danh sách category chưa xóa
  async getAllCategories(page = 1, limit = 10) {
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      Category.find({ isDeleted: false })
        .select("name createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Category.countDocuments({ isDeleted: false })
    ]);

    return {
      totalCategories: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      categories
    };
  }

  // Update category
  async updateCategory(categoryId, name) {
    if (!name || name.trim() === "") {
      throw { status: 400, message: "Tên category không được bỏ trống" };
    }

    // Kiểm tra trùng tên
    const existing = await Category.findOne({ name: name.trim(), isDeleted: false, _id: { $ne: categoryId } });
    if (existing) {
      throw { status: 400, message: "Tên category đã tồn tại" };
    }

    const category = await Category.findById(categoryId);
    if (!category || category.isDeleted) {
      throw { status: 404, message: "Không tìm thấy category" };
    }

    category.name = name.trim();
    return await category.save();
  }

  // Xóa category (xoá mềm)
  async deleteCategory(categoryId) {
    const category = await Category.findById(categoryId);
    if (!category || category.isDeleted) {
      throw { status: 404, message: "Không tìm thấy category để xóa" };
    }

    const linkedProducts = await Product.countDocuments({ categoryId, isDeleted: false });
    if (linkedProducts > 0) {
      throw { status: 400, message: "Không thể xóa category vì vẫn còn sản phẩm liên kết" };
    }

    category.isDeleted = true;
    await category.save();

    return true; 
  }
}

module.exports = new CategoryService();
