const Category = require("../models/categoryModel");

class CategoryService {
  async createCategory(name) {
    if (!name || name.trim() === "") {
      throw { status: 400, message: "Tên category không được bỏ trống" };
    }

    try {
      return await Category.create({ name: name.trim() });
    } catch (error) {
      if (error.code === 11000) {
        throw { status: 400, message: "Category đã tồn tại" };
      }
      throw error;
    }
  }

  async getAllCategories(page = 1, limit = 10) {
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      Category.find({})
        .select("name createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Category.countDocuments()
    ]);

    return {
      totalCategories: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      categories
    };
  }

  async updateCategory(categoryId, name) {
    try {
      const category = await Category.findByIdAndUpdate(
        categoryId,
        { name },
        { new: true, runValidators: true }
      );
      if (!category) {
        throw { status: 404, message: "Không tìm thấy category" };
      }
      return category;
    } catch (error) {
      if (error.code === 11000) {
        throw { status: 400, message: "Tên category đã tồn tại" };
      }
      throw error;
    }
  }

  async deleteCategory(categoryId) {
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      throw { status: 404, message: "Không tìm thấy category để xóa" };
    }
    return true;
  }
}

module.exports = new CategoryService();
