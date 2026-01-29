const express = require("express");
const { createJob, getJobs, getJobById, updateJob, deleteJob, toggleCloseJob, getJobsEmployer } = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const { createJobSchema, updateJobSchema } = require("../validators/jobValidator");

const router = express.Router();

router.route("/").post(protect, validateRequest(createJobSchema), createJob).get(getJobs);

router.route("/get-jobs-employer").get(protect, getJobsEmployer);

router.route("/:id").get(getJobById).put(protect, validateRequest(updateJobSchema), updateJob).delete(protect, deleteJob);

router.put("/:id/toggle-close", protect, toggleCloseJob);

module.exports = router;
