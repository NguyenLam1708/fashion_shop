const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");  

class OrderService {
    async createOrderCOD(userId, shippingAddress, selectedItems) {
        // selectedItems: [{ productId }, ...]

        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart || cart.items.length === 0) {
            throw { status: 400, message: "Giỏ hàng trống" };
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const selected of selectedItems) {
            const cartItem = cart.items.find(item => 
                item.productId._id.toString() === selected.productId
            );
            if (!cartItem) {
                throw { status: 404, message: `Sản phẩm ${selected.productId} không có trong giỏ hàng` };
            }

            const product = cartItem.productId;
            const price = product.price;
            const quantity = cartItem.quantity; // lấy quantity từ giỏ hàng

            // ✅ kiểm tra tồn kho trước khi tạo order
            if (product.quantity < quantity) {
                throw { status: 400, message: `Sản phẩm ${product.name} không đủ số lượng` };
            }

            // ✅ trừ stock luôn
            product.quantity -= quantity;
            await product.save();

            totalAmount += price * quantity;

            orderItems.push({
                productId: product._id,
                name: product.name,
                price: price,
                quantity
            });

        }

        const newOrder = await Order.create({
            userId,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod: "COD",
            paymentStatus: "unpaid",
            status: "pending"
        });

        await cart.save();

        return newOrder;
    }


    async getOrderById(orderId) {
        const order = await Order.findById(orderId);
        if (!order) throw { status: 404, message: "Không tìm thấy đơn hàng" };
        return order;
    }

    async getUserOrders(userId) {
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        if (!orders || orders.length === 0) {
            throw { status: 404, message: "Người dùng chưa có đơn hàng nào" };
        }
        return orders;
    }

    async updateOrder(orderId, status, paymentStatus) {
        const order = await Order.findByIdAndUpdate(
            orderId,
            { status, paymentStatus },   // gộp chung vào đây
            { new: true, runValidators: true } // options
        );

        if (!order) throw { status: 404, message: "Không tìm thấy đơn hàng" };
        return order;
    }

}

module.exports = new OrderService();
