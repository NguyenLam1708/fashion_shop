const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/cod", authMiddleware(), orderController.createOrderCOD);
router.get("/:id", authMiddleware(), orderController.getOrderById);
router.get("/", authMiddleware(), orderController.getUserOrders);
router.put("/:id", authMiddleware("admin"), orderController.updateOrder);

module.exports = router;
