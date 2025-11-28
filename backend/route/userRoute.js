const express = require("express");
const { updateProfile, deleteResume, getPublicProfile } = require("../controllers/userController");
// FIXED: path is "../middleware/..." not "../middlewares/..."
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Protected Routes

// Update Profile: Allow uploading avatar, resume, AND companyLogo
const uploadHandler = (req, res, next) => {
  const uploadMiddleware = upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 },
  ]);

  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.log("❌ UPLOAD MIDDLEWARE ERROR:", JSON.stringify(err, null, 2));
      return res.status(500).json({ message: "File Upload Failed", error: err });
    }
    next();
  });
};

// Update user profile data using the wrapper
router.put("/profile", protect, uploadHandler, updateProfile);

// Delete Resume
router.delete("/resume", protect, deleteResume); // Changed POST to DELETE (Standard practice)

// Public Route
router.get("/:id", getPublicProfile);

module.exports = router;
