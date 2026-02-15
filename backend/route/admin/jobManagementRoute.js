const express = require("express");
const { createJobAdmin, getAllJobsAdmin, deleteJobAdmin, toggleJobFeature } = require("../../controllers/admin/jobManagementController");
const { protect } = require("../../middleware/authMiddleware");
const { adminOnly } = require("../../middleware/adminAuthMiddleware");

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.post("/", createJobAdmin);
router.get("/", getAllJobsAdmin);
router.delete("/:id", deleteJobAdmin);
router.put("/:id/feature", toggleJobFeature);

module.exports = router;