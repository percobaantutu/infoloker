const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");
const { invalidateJobCache } = require("../utils/cacheInvalidator");

const JOB_LIMITS = {
  free: 1,
  basic: 3,
  premium: Infinity,
  enterprise: Infinity,
};

const FEATURED_LIMITS = {
  free: 0,
  basic: 1,
  premium: 3,
  enterprise: Infinity,
};

exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if company profile is complete
    const missingFields = [];
    if (!req.user.companyName) missingFields.push("companyName");
    if (!req.user.companyDescription) missingFields.push("companyDescription");
    if (!req.user.companyLogo) missingFields.push("companyLogo");

    if (missingFields.length > 0) {
      return res.status(403).json({
        message: "PROFILE_INCOMPLETE",
        detail: "Please complete your company profile before posting jobs.",
        missing: missingFields,
      });
    }

    // Refresh user to get the latest plan from DB (in case subscription was just activated)
    const freshUser = await User.findById(req.user._id).select("plan");
    const userPlan = freshUser?.plan || "free";
    const limit = JOB_LIMITS[userPlan];

    const activeJobsCount = await Job.countDocuments({
      company: req.user._id,
      isClosed: false,
    });

    if (activeJobsCount >= limit) {
      return res.status(403).json({
        message: "LIMIT_REACHED",
        detail: `You have reached the limit of ${limit} active jobs for the ${userPlan} plan. Please upgrade to post more.`,
      });
    }

    // Check featured limit if trying to feature the job
    if (req.body.isFeatured) {
      const featuredLimit = FEATURED_LIMITS[userPlan];
      const featuredJobsCount = await Job.countDocuments({
        company: req.user._id,
        isFeatured: true,
        isClosed: false,
      });

      if (featuredJobsCount >= featuredLimit) {
        return res.status(403).json({
          message: "FEATURED_LIMIT_REACHED",
          detail: `You have reached the limit of ${featuredLimit} featured jobs for the ${userPlan} plan.`,
        });
      }
    }

    const job = await Job.create({ ...req.body, company: req.user._id });

    // Invalidate Cache
    await invalidateJobCache();

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getJobs = async (req, res) => {
  const { keyword, location, category, type, minSalary, maxSalary, userId } =
    req.query;

  const query = {
    isClosed: false,
    ...(keyword && { title: { $regex: keyword, $options: "i" } }),
    ...(location && { location: { $regex: location, $options: "i" } }),
    ...(category && { category }),
    ...(type && { type }),
  };

  if (minSalary || maxSalary) {
    query.$and = [];
    if (minSalary) query.$and.push({ salaryMax: { $gte: Number(minSalary) } });
    if (maxSalary) query.$and.push({ salaryMin: { $lte: Number(maxSalary) } });
    if (query.$and.length === 0) delete query.$and;
  }

  try {
    const jobs = await Job.find(query)
      .populate("company", "name companyName companyLogo location plan")
      .sort({ isFeatured: -1, createdAt: -1 });

    let savedJobsIds = [];
    let appliedJobStatusMap = {};

    if (userId && userId !== "undefined") {
      const savedJobs = await SavedJob.find({ jobseeker: userId }).select(
        "job",
      );
      savedJobsIds = savedJobs.map((sj) => sj.job.toString());

      const applications = await Application.find({ applicant: userId }).select(
        "job status",
      );
      applications.forEach((app) => {
        appliedJobStatusMap[app.job.toString()] = app.status;
      });
    }

    const jobWithExtras = jobs.map((job) => {
      const jobIdStr = String(job._id);
      return {
        ...job.toObject(),
        isSaved: savedJobsIds.includes(jobIdStr),
        applicationStatus: appliedJobStatusMap[jobIdStr] || null,
      };
    });

    res.status(200).json(jobWithExtras);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "company",
      "name companyName companyLogo companyDescription email plan",
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getJobsEmployer = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }
    const jobs = await Job.find({ company: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ job: job._id });
        return {
          ...job,
          applicationsCount: count,
        };
      }),
    );

    res.status(200).json(jobsWithStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // Invalidate Cache
    await invalidateJobCache(req.params.id);

    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();

    // Invalidate Cache
    await invalidateJobCache(req.params.id);

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleCloseJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    job.isClosed = !job.isClosed;
    await job.save();

    // Invalidate Cache
    await invalidateJobCache(req.params.id);

    res
      .status(200)
      .json({
        message: `Job is now ${job.isClosed ? "Closed" : "Open"}`,
        isClosed: job.isClosed,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
