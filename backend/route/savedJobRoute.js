const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { saveJob, getSavedJobs, removeSavedJob } = require("../controllers/savedJobController");

router.post("/:jobId", protect, saveJob);
router.get("/my", protect, getSavedJobs);
router.delete("/:jobId", protect, removeSavedJob);
module.exports = router;
