const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware")

router.post('/register',authController.register);
router.post("/verify-otp", authController.verifyOtp);
router.post('/login',authController.login);
router.post("/resend-otp", authController.resendOtp);

module.exports = router;