const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const { route } = require("./productRoutes");

router.get("/my-info", authMiddleware(), userController.getMe);
router.patch("/change-password", authMiddleware(), userController.changePassword);
router.put("/change-info", authMiddleware(), userController.changeInfo);
router.post("/forgot-password", userController.forgotPassword);

//admin
router.get("",authMiddleware("admin"),userController.getAllUsers);
router.put("/:id", authMiddleware("admin"), userController.updateUser);
router.patch("/:id/ban", authMiddleware("admin"), userController.banUser);
router.patch("/:id/active", authMiddleware("admin"), userController.activeUser);

module.exports = router;