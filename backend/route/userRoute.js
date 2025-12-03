const express = require("express");
const { updateProfile, deleteResume, getPublicProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); // <--- Ensure this is imported

const router = express.Router();

// Protected Routes

// 🚨 CRITICAL FIX: The 'upload.fields' middleware MUST be here.
// It parses the file data. Without it, req.body is undefined.
router.put(
  "/profile",
  protect,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 },
  ]),
  updateProfile
);

// Delete Resume
router.delete("/resume", protect, deleteResume);

// Public Route
router.get("/:id", getPublicProfile);

module.exports = router;
