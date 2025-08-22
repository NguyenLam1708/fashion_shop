const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const productController = require("../controllers/productController");
const upload = require('../middleware/upload');

router.get("/", authMiddleware(), productController.getAllProducts);
router.get("/category/:categoryId", authMiddleware(), productController.getProductByCategory);
router.get("/:id", authMiddleware(), productController.getProduct);
router.post("/", authMiddleware("admin"), upload.array('images', 5), productController.createProduct);
router.delete("/:id", authMiddleware("admin"), productController.deleteProduct);
router.put("/:id", authMiddleware("admin"), upload.array("images", 5),productController.updateProduct);

module.exports = router;
