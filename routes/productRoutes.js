const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const productController = require("../controllers/productController");
const upload = require('../middleware/upload');

router.post("",authMiddleware("admin"), upload.array('images', 5), productController.createProduct);

module.exports = router;