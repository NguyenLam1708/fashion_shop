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

    async getAllOrders(req, res) {
        try {
            const { page = 1, limit = 10, status, paymentStatus } = req.query;

            // build filter
            const filter = {};
            if (status) filter.status = status;
            if (paymentStatus) filter.paymentStatus = paymentStatus;

            const data = await orderService.getAllOrders(
            parseInt(page),
            parseInt(limit),
            filter
            );

            res.json({ message: "Lấy danh sách đơn hàng thành công", data });
        } catch (err) {
            res.status(err.status || 500).json({ message: err.message || "Lỗi server" });
        }
    };

    async cancelOrder(req, res) {
        try {
            const { orderId } = req.params;
            const userId = req.user.id; 

            const order = await orderService.cancelOrder(orderId, userId);

            res.json({
            message: "Hủy đơn hàng thành công",
            data: order,
            });
        } catch (err) {
            res.status(err.status || 500).json({
            message: err.message || "Lỗi server khi hủy đơn",
            });
        }
    };  

    async getOrders(req, res) {
        try {
            const userId = req.user.id; // từ middleware
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const result = await orderService.getOrders(userId, page, limit);

            return res.status(200).json({
            message: "Lấy danh sách đơn hàng thành công",
            data: result
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
