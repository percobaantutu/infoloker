const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");

// @desc    Create a new job (Employer only)
exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can post jobs" });
    }

    const job = await Job.create({ ...req.body, company: req.user._id });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all jobs (Public with Filters)
exports.getJobs = async (req, res) => {
  const { keyword, location, category, type, minSalary, maxSalary, userId } = req.query;

  // Build Filter Query
  const query = {
    isClosed: false,
    ...(keyword && { title: { $regex: keyword, $options: "i" } }),
    ...(location && { location: { $regex: location, $options: "i" } }),
    ...(category && { category }),
    ...(type && { type }),
  };

  // Salary Logic (Find jobs that overlap with the requested range)
  if (minSalary || maxSalary) {
    query.$and = [];
    if (minSalary) query.$and.push({ salaryMax: { $gte: Number(minSalary) } });
    if (maxSalary) query.$and.push({ salaryMin: { $lte: Number(maxSalary) } });
    if (query.$and.length === 0) delete query.$and;
  }

  try {
    const jobs = await Job.find(query)
      .populate("company", "name companyName companyLogo location") // Fixed fields
      .sort({ createdAt: -1 });

    let savedJobsIds = []; // Fixed variable name
    let appliedJobStatusMap = {};

    // If userId is provided, check saved/applied status
    if (userId && userId !== "undefined") {
      // Get Saved Jobs
      const savedJobs = await SavedJob.find({ jobseeker: userId }).select("job"); // Fixed: model uses 'jobseeker' not 'jobSeeker'
      savedJobsIds = savedJobs.map((sj) => sj.job.toString());

      // Get Applied Jobs
      const applications = await Application.find({ applicant: userId }).select("job status");
      applications.forEach((app) => {
        appliedJobStatusMap[app.job.toString()] = app.status;
      });
    }

    // Merge Data
    const jobWithExtras = jobs.map((job) => {
      const jobIdStr = String(job._id);
      return {
        ...job.toObject(),
        isSaved: savedJobsIds.includes(jobIdStr),
        applicationStatus: appliedJobStatusMap[jobIdStr] || null,
      };
    });

    // FIXED: Actually send the response
    res.status(200).json(jobWithExtras);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("company", "name companyName companyLogo companyDescription email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get jobs posted by the logged-in Employer
exports.getJobsEmployer = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }
    const jobs = await Job.find({ company: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update Job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check ownership
    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete Job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Toggle Job Status (Open/Close)
exports.toggleCloseJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    job.isClosed = !job.isClosed;
    await job.save();
    res.status(200).json({ message: `Job is now ${job.isClosed ? "Closed" : "Open"}`, isClosed: job.isClosed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
