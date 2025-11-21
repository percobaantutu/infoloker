const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", upload.single("avatar"), register);

// Public routes (no authentication needed)
router.post("/register", register);
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

module.exports = router;
