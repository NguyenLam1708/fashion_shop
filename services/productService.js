const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

class ProductService {
  // Tạo sản phẩm mới
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

  // Lấy tất cả sản phẩm chưa xóa, phân trang
  async getAllProducts(page = 1, limit = 10) {
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find({ isDeleted: false })
        .select("name description price quantity size color categoryId createdAt imageUrl")
        .populate({
          path: "categoryId",
          select: "name _id"
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments({ isDeleted: false })
    ]);

    return {
      totalProducts: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      products
    };
  }

  // Lấy sản phẩm theo ID, chỉ lấy sản phẩm chưa xóa
  async getProductById(id) {
    const product = await Product.findOne({ _id: id, isDeleted: false })
      .populate('categoryId', 'name');
    if (!product) {
      throw { status: 404, message: "Không tìm thấy sản phẩm" };
    }
    return product;
  }

  // Lấy sản phẩm theo category, chỉ lấy sản phẩm chưa xóa
  async getProductsByCategory(categoryId, page = 1, limit = 15) {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw { status: 404, message: "Category không tồn tại" };
    }

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments({ categoryId, isDeleted: false });
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find({ categoryId, isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      products,
      totalPages,
      currentPage: page,
    };
  }

  // Soft delete sản phẩm
  async deleteProduct(id) {
    const inCart = await Cart.findOne({ 'items.productId': id });
    const inOrder = await Order.findOne({ 'items.productId': id });
    if (inCart || inOrder) {
      throw { status: 400, message: "Sản phẩm đang trong giỏ hàng hoặc đơn hàng, không thể xóa" };
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!product) {
      throw { status: 404, message: "Không tìm thấy sản phẩm" };
    }

    return true;
  }

  // Cập nhật sản phẩm, chỉ update sản phẩm chưa xóa
  async updateProduct(id, data, files) {
    let updateData = { ...data };

    if (files && files.length > 0) {
      updateData.imageUrl = files.length === 1
        ? [`uploads/${files[0].filename}`]
        : files.map(file => `uploads/${file.filename}`);
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updateData,
      { new: true }
    );

    if (!product) {
      throw { status: 404, message: "Không tìm thấy sản phẩm để cập nhật" };
    }

    return product;
  }
}

module.exports = new ProductService();
