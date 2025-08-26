const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware")

router.get("/my-info", authMiddleware(), userController.getMe);
router.post("/change-password", authMiddleware(), userController.changePassword);
router.post("/change-info", authMiddleware(), userController.changeInfo);
router.post("/forgot-password", userController.forgotPassword);

//admin
router.get("",authMiddleware("admin"),userController.getAllUsers);
router.put("/:id", authMiddleware("admin"), userController.updateUser);
router.get("/:id", authMiddleware("admin"), userController.getUserById);

module.exports = router;