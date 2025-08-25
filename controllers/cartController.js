const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// lấy giỏ hàng của user
exports.getCart = async(req,res) =>{
    try{
        const cart = await Cart.findOne({userId: req.user.id})
            .populate("items.productId","name price imageUrl");
        if(!cart){
            return res.status(200).json({message:"Giỏ hàng trống", items: [] });
        }
        res.status(200).json({message:"lấy giỏ hàng thành công", data: cart});
    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Lỗi server",error: error.message})
    }
}
exports.addToCart = async(req,res) =>{
    try{
        const {productId, quantity} = req.body;
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({message:"Không tìm thấy sản phẩm"});
        }

        let cart = await Cart.findOne({userId: req.user.id});
        if(!cart){
            cart = new Cart({
                userId: req.user.id,
                items:[{productId, quantity}]
            });
        }else{
            //findIndex Nó sẽ tìm phần tử đầu tiên trong mảng thỏa mãn điều kiện (callback function) và trả về vị trí (index) của phần tử đó.
            //Nếu không tìm thấy thì trả về -1.x
            const itemIndex = cart.items.findIndex(item  => item.productId.equals(productId));
            if (itemIndex > -1) {
                // nếu có rồi thì cộng thêm số lượng
                cart.items[itemIndex].quantity += quantity;
            } else {
                // nếu chưa có thì push mới
                cart.items.push({ productId, quantity });
            }
        }
        await cart.save();
        res.status(200).json({ message: "Đã thêm vào giỏ hàng", data: cart });
    }catch(error){
        return res.status(500).json({message:"Lỗi server", error: error.message});
    }
}

/// Cập nhật số lượng sản phẩm trong giỏ(set cho nó luôn nhưng tối thiểu là 1)
exports.updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Số lượng tối thiểu là 1" });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

    // kiểm tra tồn kho
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

    if (quantity > product.quantity) {
      return res.status(400).json({
        message: `Chỉ còn ${product.quantity} sản phẩm trong kho`
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity; // set tuyệt đối
    } else {
      return res.status(404).json({ message: "Sản phẩm không có trong giỏ hàng" });
    }

    await cart.save();
    res.status(200).json({ message: "Đã cập nhật giỏ hàng", data: cart });

  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// xoá một sản phẩm 
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

    cart.items = cart.items.filter(items => !items.productId.equals(productId));
    await cart.save();

    res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ", data: cart });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// xoá toàn bộ giỏ hàng
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Đã xóa toàn bộ giỏ hàng" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};