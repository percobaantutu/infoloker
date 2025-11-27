const express = require("express");
const { updateProfile, deleteResume, getPublicProfile } = require("../controllers/userController");
// FIXED: path is "../middleware/..." not "../middlewares/..."
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Protected Routes

// Update Profile: Allow uploading avatar, resume, AND companyLogo
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
router.delete("/resume", protect, deleteResume); // Changed POST to DELETE (Standard practice)

// Public Route
router.get("/:id", getPublicProfile);

module.exports = router;
