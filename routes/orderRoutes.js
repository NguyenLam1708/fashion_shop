const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/cod", authMiddleware(), orderController.createOrderCOD);
router.get("/me", authMiddleware(), orderController.getOrders);
router.put("/:orderId/cancel", authMiddleware(), orderController.cancelOrder);
router.put("/:id", authMiddleware("admin"), orderController.updateOrder);
router.get("/", authMiddleware("admin"), orderController.getAllOrders);

module.exports = router;
