const express = require("express");
const { updateProfile, deleteResume, getPublicProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validate = require("../middleware/validationMiddleware");
const { updateProfileSchema } = require("../validators/userValidator");

const router = express.Router();


router.put(
  "/profile",
  protect,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  validate(updateProfileSchema),
  updateProfile
);


router.delete("/resume", protect, deleteResume);


router.get("/:id", getPublicProfile);

module.exports = router;
