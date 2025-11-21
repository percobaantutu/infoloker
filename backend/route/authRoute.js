const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public routes (no authentication needed)
router.post("/register", register);
router.post("/login", login);

// Protected route (authentication required)
router.get("/me", protect, getMe);

router.post("/upload-image", upload.single("image"), (req, res) => {
  // Check if a file was successfully uploaded
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Construct the full URL for the uploaded image
  // This assumes your Express server is running and configured to serve the 'uploads' folder
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  // Respond with the public URL of the image
  res.status(200).json({ imageUrl });
});

module.exports = router;
