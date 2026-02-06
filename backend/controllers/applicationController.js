const Application = require("../models/Application");
const Job = require("../models/Job");
const sendEmail = require("../utils/sendEmail");
const Notification = require("../models/Notification");
const sseService = require("../services/sseService");

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (Job Seeker)
exports.applyToJob = async (req, res) => {
  try {
    // 1. Check Role
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Only job seekers can apply" });
    }

    // 2. Check if Job exists AND populate company to get email
    const job = await Job.findById(req.params.jobId).populate("company", "name email");
    
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

    // 6. Send Email to Employer
    const message = `
      Hello ${job.company.name},

      Good news! You have received a new application for the position of "${job.title}".

      Applicant: ${req.user.name}
      Email: ${req.user.email}

      Log in to your dashboard to review their resume and details.
    `;

    try {
      await sendEmail({
        email: job.company.email, // Send to the Employer
        subject: `New Applicant for ${job.title}`,
        message,
      });
      await Notification.create({
  user: job.company._id, // Send to Employer
  message: `New applicant: ${req.user.name} for ${job.title}`,
  type: "new_applicant",
  relatedId: application._id
});
      // Broadcast via SSE for real-time notification
      sseService.sendToUser(job.company._id, {
        type: "new_applicant",
        message: `New applicant: ${req.user.name} for ${job.title}`,
        relatedId: application._id,
        createdAt: new Date().toISOString()
      });
    } catch (emailError) {
      console.error("New Applicant Email Failed:", emailError);
    }

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
    const { status } = req.body;

    // 2. Populate 'job' AND 'applicant' to get email and title
    const application = await Application.findById(req.params.id)
      .populate("job", "title company") 
      .populate("applicant", "email name");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Security Check
    if (application.job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    // Update Status
    application.status = status;
    await application.save();

    // 3. Send Email Notification
    const message = `
      Hello ${application.applicant.name},

      Your application status for the position of "${application.job.title}" has been updated.

      New Status: ${status}

      Log in to your dashboard to view more details.
    `;

    try {
      await sendEmail({
        email: application.applicant.email,
        subject: `Application Update: ${application.job.title}`,
        message,
      });
      await Notification.create({
  user: application.applicant._id,
  message: `Status Update: Your application for ${application.job.title} is now ${status}`,
  type: "status_update",
  relatedId: application._id
});
      // Broadcast via SSE for real-time notification
      sseService.sendToUser(application.applicant._id, {
        type: "status_update",
        message: `Status Update: Your application for ${application.job.title} is now ${status}`,
        relatedId: application._id,
        createdAt: new Date().toISOString()
      });
    } catch (emailError) {
      console.error("Status Email Failed:", emailError);
      // We don't stop the request here, just log the error
    }

    res.json({ message: "Application status updated and email sent", status });
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
