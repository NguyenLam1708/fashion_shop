const productService = require("../services/productService");

class ProductController {
  async createProduct(req, res) {
    try {
      const newProduct = await productService.createProduct(req.body, req.files);
      res.status(201).json({ message: "Tạo sản phẩm thành công", data: newProduct });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ message: error.message || "Lỗi server" });
    }
  }

  async getAllProducts(req, res) {
    try {
      const data = await productService.getAllProducts(req.query.page, req.query.limit);
      res.status(200).json({ message: "Lấy danh sách sản phẩm thành công", data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }

  async getProduct(req, res) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  async getProductByCategory(req, res) {
    try {
      const products = await productService.getProductsByCategory(req.params.categoryId);
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(200).json({ message: "Xóa sản phẩm thành công" });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body, req.files);
      res.status(200).json({ message: "Cập nhật sản phẩm thành công", data: product });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ message: error.message });
    }
  }
}

module.exports = new ProductController();
