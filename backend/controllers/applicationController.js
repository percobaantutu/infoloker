const Application = require("../models/Application");
const Job = require("../models/Job");

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (Job Seeker)
exports.applyToJob = async (req, res) => {
  try {
    // 1. Check Role
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Only job seekers can apply" });
    }

    // 2. Check if Job exists
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 3. Check if user has a resume
    if (!req.user.resume) {
      return res.status(400).json({ message: "Please upload your resume in your profile before applying." });
    }

    // 4. Check for existing application
    const existing = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    // 5. Create Application
    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      resume: req.user.resume,
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get logged-in user's applications
// @route   GET /api/applications/my
// @access  Private (Job Seeker)
exports.getMyApplications = async (req, res) => {
  try {
    // FIXED: Variable name mismatch (apps vs applications)
    const apps = await Application.find({ applicant: req.user._id })
      .populate({
        path: "job",
        select: "title company location type salaryMin salaryMax companyLogo",
        populate: { path: "company", select: "name companyName companyLogo" },
      })
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all applicants for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
exports.getApplicantsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // SECURITY: Ensure the logged-in user is the owner of the job
    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view applicants for this job" });
    }

    const applications = await Application.find({ job: req.params.jobId }).populate("applicant", "name email avatar resume").populate("job", "title type location category salaryMin salaryMax").sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single application details
// @route   GET /api/applications/:id
// @access  Private
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate("job", "title company").populate("applicant", "name email avatar resume");

    if (!application) {
      return res.status(404).json({ message: "Application not found", id: req.params.id });
    }

    const isOwner = application.applicant._id.toString() === req.user._id.toString() || application.job.company.toString() === req.user._id.toString();

    if (!isOwner) {
      return res.status(403).json({ message: "Not authorized to view this application" });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body; // e.g., "In Review", "Accepted", "Rejected"

    // Find application and populate job to check ownership
    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // SECURITY: Check if logged-in user is the job owner
    if (application.job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    res.json({ message: "Application status updated", status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllEmployerApplications = async (req, res) => {
  try {
    // 1. Find all jobs posted by this employer
    const jobs = await Job.find({ company: req.user._id }).select("_id").lean();
    const jobIds = jobs.map((job) => job._id);

    // 2. Find all applications for those jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("applicant", "name email avatar resume")
      .populate("job", "title type location category salaryMin salaryMax")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
