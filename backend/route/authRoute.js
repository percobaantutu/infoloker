const express = require("express");
const { register, login, getMe, testEmail, forgotPassword, resetPassword, verifyEmail, 
  resendOtp, googleLogin  } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { authLimiter } = require("../middleware/rateLimitMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const {
  registerSchema, loginSchema, verifyEmailSchema, resendOtpSchema,
  forgotPasswordSchema, resetPasswordSchema, googleLoginSchema
} = require("../validators/authValidator");

const router = express.Router();

router.post("/register", authLimiter, upload.single("avatar"), validateRequest(registerSchema), register);
router.post("/login", authLimiter, validateRequest(loginSchema), login);
router.post("/google", authLimiter, validateRequest(googleLoginSchema), googleLogin);
router.post("/forgot-password", authLimiter, validateRequest(forgotPasswordSchema), forgotPassword);
router.put("/reset-password/:resetToken", authLimiter, validateRequest(resetPasswordSchema), resetPassword);
router.post("/verify-email", authLimiter, validateRequest(verifyEmailSchema), verifyEmail);
router.post("/resend-otp", authLimiter, validateRequest(resendOtpSchema), resendOtp);

router.get("/me", protect, getMe); 

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  
  res.status(200).json({ imageUrl: req.file.path });
});

router.post("/test-email", testEmail);

module.exports = router;
