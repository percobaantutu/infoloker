const express = require("express");
const { applyToJob, getMyApplications, getApplicantsForJob, getApplicationById, updateStatus, getAllEmployerApplications } = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const { updateStatusSchema } = require("../validators/applicationValidator");

const router = express.Router();

router.get("/employer/all", protect, getAllEmployerApplications);
router.post("/:jobId", protect, applyToJob);
router.get("/my", protect, getMyApplications);
router.get("/job/:jobId", protect, getApplicantsForJob);
router.get("/:id", protect, getApplicationById);
router.put("/:id/status", protect, validateRequest(updateStatusSchema), updateStatus);

module.exports = router;
