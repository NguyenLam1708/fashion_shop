const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const mongoose = require("mongoose");

class CartService {
  async getCart(userId) {
    const cart = await Cart.findOne({ userId })
      .populate("items.productId", "name price imageUrl");
    return cart;
  }

  async addToCart(userId, productId, quantity) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw { status: 400, message: "productId không hợp lệ" };
    }
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      throw { status: 400, message: "Số lượng phải là số nguyên dương" };
    }

    // 2) Lấy sản phẩm + kiểm tra tồn kho
    const product = await Product.findById(productId).select("quantity name price");
    if (!product) throw { status: 404, message: "Không tìm thấy sản phẩm" };
    if (qty > product.quantity) {
      throw { status: 400, message: `Chỉ còn ${product.quantity} sản phẩm trong kho` };
    }

    // 3) Tìm/ tạo giỏ
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity: qty }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        const currentQty = cart.items[itemIndex].quantity;
        const newQty = currentQty + qty;

        if (newQty > product.quantity) {
          throw {
            status: 400,
            message: `Trong kho chỉ còn ${product.quantity}. Bạn đã có ${currentQty} trong giỏ.`
          };
        }
        cart.items[itemIndex].quantity = newQty;
      } else {
        cart.items.push({ productId, quantity: qty });
      }
    }

    await cart.save();
    // (tuỳ chọn) populate để FE có đủ dữ liệu hiển thị
    await cart.populate("items.productId", " name price imageUrl");

    return cart;
  }

  async updateQuantity(userId, productId, quantity) {
    if (quantity < 1) throw new Error("Số lượng tối thiểu là 1");

    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("Không tìm thấy giỏ hàng");

    const product = await Product.findById(productId);
    if (!product) throw new Error("Sản phẩm không tồn tại");

    if (quantity > product.quantity) {
      throw new Error(`Chỉ còn ${product.quantity} sản phẩm trong kho`);
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      throw new Error("Sản phẩm không có trong giỏ hàng");
    }

    await cart.save();
    return cart;
  }

  async removeFromCart(userId, productId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("Không tìm thấy giỏ hàng");

    const product = await Product.findById(productId);
    if (!product) throw new Error("Sản phẩm không tồn tại");

    // kiểm tra sản phẩm có trong giỏ không
    const exists = cart.items.some(item => item.productId.equals(productId));
    if (!exists) {
        const err = new Error("Sản phẩm không có trong giỏ hàng");
        err.statusCode = 404; // gắn status code riêng
        throw err;
    }

    cart.items = cart.items.filter(item => !item.productId.equals(productId));
    await cart.save();
    return cart;
   }


  async clearCart(userId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("Không tìm thấy giỏ hàng");

    cart.items = [];
    await cart.save();
    return cart;
  }
}

module.exports = new CartService();
