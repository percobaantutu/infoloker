const express = require("express");
const { register, login, getMe, testEmail, forgotPassword, resetPassword, verifyEmail, 
  resendOtp  } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", upload.single("avatar"), register);

// Public routes (no authentication needed)
router.post("/login", login);

// Protected route (authentication required)
router.get("/me", protect, getMe);

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // Cloudinary returns the URL in req.file.path
  res.status(200).json({ imageUrl: req.file.path });
});

router.post("/test-email", testEmail);
router.post("/verify-email", verifyEmail); 
router.post("/resend-otp", resendOtp);   
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);

module.exports = router;
