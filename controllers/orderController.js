const orderService = require("../services/orderService");

class OrderController {
    async createOrderCOD(req, res) {
        try {
            const userId = req.user.id; // user lấy từ authMiddleware
            const { shippingAddress, selectedItems } = req.body;

            const order = await orderService.createOrderCOD(
                userId,
                shippingAddress,
                selectedItems
            );

            return res.status(201).json({
                message: "Tạo đơn hàng COD thành công",
                data: order
            });
        } catch (err) {
            return res.status(err.status || 500).json({
                message: err.message || "Lỗi server"
            });
        }
    }

    async getOrderById(req, res) {
        try {
            const { id } = req.params;
            const order = await orderService.getOrderById(id);

            return res.status(200).json({
                message:"Lấy danh sách đơn hàng thành công",
                data: order
            });
        } catch (err) {
            return res.status(err.status || 500).json({
                message: err.message || "Lỗi server"
            });
        }
    }

    async getUserOrders(req, res) {
        try {
            const userId = req.user.id; // từ middleware
            const orders = await orderService.getUserOrders(userId);

            return res.status(200).json({
                message:"Lấy danh sách đơn hàng thành công",
                data: orders
            });
        } catch (err) {
            return res.status(err.status || 500).json({
                message: err.message || "Lỗi server"
            });
        }
    }

    async updateOrder(req, res) {
        try {
            const { id } = req.params;  // orderId
            const { status, paymentStatus } = req.body;

            const updatedOrder = await orderService.updateOrder(id, status, paymentStatus);

            return res.status(200).json({
                message: "Cập nhật đơn hàng thành công",
                data: updatedOrder
            });
        } catch (err) {
            return res.status(err.status || 500).json({
                message: err.message || "Lỗi server"
            });
        }
    }
}

module.exports = new OrderController();
