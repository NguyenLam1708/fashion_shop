const cartService = require("../services/cartService");

class CartController {
  async getCart(req, res) {
    try {
      const cart = await cartService.getCart(req.user.id);
      if (!cart) {
        return res.status(200).json({ message: "Giỏ hàng trống", items: [] });
      }
      res.status(200).json({ message: "Lấy giỏ hàng thành công", data: cart });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }

  async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;
      const cart = await cartService.addToCart(req.user.id, productId, quantity);
      res.status(200).json({ message: "Đã thêm vào giỏ hàng", data: cart });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateQuantity(req, res) {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      const cart = await cartService.updateQuantity(req.user.id, productId, quantity);
      res.status(200).json({ message: "Đã cập nhật giỏ hàng", data: cart });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async removeFromCart(req, res) {
    try {
      const { productId } = req.params;
      const cart = await cartService.removeFromCart(req.user.id, productId);
      res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ", data: cart });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async clearCart(req, res) {
    try {
      await cartService.clearCart(req.user.id);
      res.status(200).json({ message: "Đã xóa toàn bộ giỏ hàng" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new CartController();
