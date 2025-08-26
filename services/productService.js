const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

class ProductService {
  async createProduct(data, files) {
    const { name, description, price, quantity, categoryId, size, color } = data;

    // Kiểm tra category
    const category = await Category.findById(categoryId);
    if (!category) {
      throw { status: 400, message: "Category không tồn tại" };
    }

    // Xử lý ảnh
    let imageUrl = [];
    if (files && files.length > 0) {
      imageUrl = files.map(file => `uploads/${file.filename}`);
    }

    try {
      return await Product.create({
        name,
        description,
        price,
        quantity,
        imageUrl,
        categoryId,
        size,
        color
      });
    } catch (error) {
      if (error.code === 11000) {
        throw { status: 400, message: "Sản phẩm đã tồn tại (trùng name + size + color)" };
      }
      throw error;
    }
  }

  async getAllProducts(page = 1, limit = 10) {
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find({})
        .select("name description price quantity size color categoryId createdAt imageUrl")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments()
    ]);

    return {
      totalProducts: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      products
    };
  }

  async getProductById(id) {
    const product = await Product.findById(id);
    if (!product) {
      throw { status: 404, message: "Không tìm thấy sản phẩm" };
    }
    return product;
  }

  async getProductsByCategory(categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw { status: 404, message: "Category không tồn tại" };
    }
    return await Product.find({ categoryId }).sort({ createdAt: -1 });
  }

  async deleteProduct(id) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw { status: 404, message: "Không tìm thấy sản phẩm để xóa" };
    }
    return true;
  }

  async updateProduct(id, data, files) {
    let updateData = { ...data };

    if (files && files.length > 0) {
      if (files.length === 1) {
        updateData.imageUrl = [`uploads/${files[0].filename}`];
      } else {
        updateData.imageUrl = files.map(file => `uploads/${file.filename}`);
      }
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) {
      throw { status: 404, message: "Không tìm thấy sản phẩm để cập nhật" };
    }
    return product;
  }
}

module.exports = new ProductService();
