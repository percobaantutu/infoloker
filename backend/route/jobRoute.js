const express = require("express");
const { 
  createJob, 
  getJobs, 
  getJobById, 
  updateJob, 
  deleteJob, 
  toggleCloseJob, 
  getJobsEmployer 
} = require("../controllers/jobController");

const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware"); 
const { jobSchema } = require("../validators/jobValidator");   

const router = express.Router();


router.route("/")
  .post(protect, validate(jobSchema), createJob) 
  .get(getJobs);


router.route("/get-jobs-employer")
  .get(protect, getJobsEmployer);


router.route("/:id")
  .get(getJobById)
  .put(protect, validate(jobSchema), updateJob) 
  .delete(protect, deleteJob);


router.put("/:id/toggle-close", protect, toggleCloseJob);

module.exports = router;