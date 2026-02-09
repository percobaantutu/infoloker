const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Controllers
const { 
  register, 
  login, 
  getMe, 
  testEmail, 
  forgotPassword, 
  resetPassword, 
  verifyEmail, 
  resendOtp, 
  googleLogin  
} = require("../controllers/authController");

// Get Public Key for credential encryption
const getPublicKey = (req, res) => {
  try {
    // First try environment variable (production)
    if (process.env.RSA_PUBLIC_KEY) {
      return res.json({ publicKey: process.env.RSA_PUBLIC_KEY.replace(/\\n/g, '\n') });
    }
    
    // Fall back to file (development)
    const keyPath = path.join(__dirname, "../config/keys/public.pem");
    if (fs.existsSync(keyPath)) {
      const publicKey = fs.readFileSync(keyPath, "utf8");
      return res.json({ publicKey });
    }
    
    // No key available - encryption disabled
    return res.json({ publicKey: null, message: "Encryption not configured" });
  } catch (error) {
    console.error("Error reading public key:", error);
    res.status(500).json({ message: "Failed to retrieve public key" });
  }
};

// Middlewares
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { authLimiter } = require("../middleware/rateLimitMiddleware");
const validate = require("../middleware/validationMiddleware");

// Validators
const {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validators/authValidator");

// --- ROUTES ---

// REGISTER: Limiter -> Multer (Parses Body) -> Validator (Checks Body) -> Controller
router.post("/register", authLimiter, upload.single("avatar"), validate(registerSchema), register);

// LOGIN: Limiter -> Validator -> Controller
router.post("/login", authLimiter, validate(loginSchema), login);

// VERIFY EMAIL: Limiter -> Validator -> Controller
router.post("/verify-email", authLimiter, validate(verifyEmailSchema), verifyEmail);

// FORGOT PASSWORD: Limiter -> Validator -> Controller
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), forgotPassword);

// RESET PASSWORD: Limiter -> Validator -> Controller
router.put("/reset-password/:resetToken", authLimiter, validate(resetPasswordSchema), resetPassword);

// OTHERS
router.post("/resend-otp", authLimiter, resendOtp);
router.post("/google", authLimiter, googleLogin);
router.get("/me", protect, getMe);

// TEST/UTIL
router.post("/test-email", testEmail);
router.get("/public-key", getPublicKey); // For credential encryption
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.status(200).json({ imageUrl: req.file.path });
});

module.exports = router;