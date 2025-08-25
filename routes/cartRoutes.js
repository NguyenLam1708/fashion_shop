const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware(), cartController.getCart);
router.post("/", authMiddleware(), cartController.addToCart);
router.delete("/item/:productId", authMiddleware(), cartController.removeFromCart);
router.delete("/clear", authMiddleware(), cartController.clearCart);
router.put("/:productId", authMiddleware(), cartController.updateQuantity);

module.exports = router;
