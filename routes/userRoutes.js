const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware")

router.get("/me", authMiddleware, userController.getMe);
router.post("/change-password", authMiddleware, userController.changePassword);
router.post("/change-info", authMiddleware, userController.changeInfo);
router.post("/forgot-password", authMiddleware, userController.forgotPassword);
router.get("",authMiddleware("admin"),userController.getAllUsers);

module.exports = router;