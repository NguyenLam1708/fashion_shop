const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware(), categoryController.getAllCategories);
router.post("",authMiddleware("admin"),categoryController.createCategory);
router.patch("/:categoryId",authMiddleware("admin"),categoryController.updateCategory);
router.delete("/:categoryId",authMiddleware("admin"),categoryController.deleteCategory);

module.exports = router;