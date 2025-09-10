const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");  
const Product = require("../models/productModel");

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

    async cancelOrder(orderId, userId) {
        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) throw { status: 404, message: "Không tìm thấy đơn hàng" };

        if (order.status === "cancelled") {
            throw { status: 400, message: "Đơn hàng đã bị hủy trước đó" };
        }

        if (["shipped", "delivered"].includes(order.status)) {
            throw { status: 400, message: "Đơn hàng đã giao không thể hủy" };
        }

        // hoàn lại stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { quantity: item.quantity },
            });
        }

        order.status = "cancelled";
        await order.save();

        return order;
    }

    async getAllOrders(page = 1, limit = 10, filter = {}) {
        const skip = (page - 1) * limit;

        // filter có thể là { status: "pending" } hoặc { paymentStatus: "paid" }
        const query = { ...filter };

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("userId", "name email") // hiện thông tin user
            .populate("items.productId", "name size color imageUrl"); // hiện thêm chi tiết sản phẩm

        const total = await Order.countDocuments(query);

        return {
            total,
            page,
            totalPages: Math.ceil(total / limit),
            orders,
        };
    }

    async getOrders(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
            path: "items.productId", 
            select: "size color imageUrl",
            });

        const total = await Order.countDocuments({ userId });

        return {
            total,
            page,
            totalPages: Math.ceil(total / limit),
            orders,
        };
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
