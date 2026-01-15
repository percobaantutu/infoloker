const express = require("express");
const { register, login, getMe, testEmail, forgotPassword, resetPassword, verifyEmail, 
  resendOtp, googleLogin  } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { authLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.post("/register", authLimiter, upload.single("avatar"), register);
router.post("/login", authLimiter, login);
router.post("/google", authLimiter, googleLogin);
router.post("/forgot-password", authLimiter, forgotPassword);
router.put("/reset-password/:resetToken", authLimiter, resetPassword);
router.post("/verify-email", authLimiter, verifyEmail);
router.post("/resend-otp", authLimiter, resendOtp);

router.get("/me", protect, getMe); 

router.post("/register", upload.single("avatar"), register);


router.post("/login", login);


router.get("/me", protect, getMe);

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  
  res.status(200).json({ imageUrl: req.file.path });
});

router.post("/test-email", testEmail);
router.post("/verify-email", verifyEmail); 
router.post("/resend-otp", resendOtp);   
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);
router.post("/google", googleLogin);
module.exports = router;
