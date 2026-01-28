const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");

const JOB_LIMITS = {
  free: 1,
  basic: 3,
  premium: Infinity,
  enterprise: Infinity
};

exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

   
    const userPlan = req.user.plan || "free"; 
    const limit = JOB_LIMITS[userPlan];


    const activeJobsCount = await Job.countDocuments({ 
      company: req.user._id,
      isClosed: false 
    });

    
    if (activeJobsCount >= limit) {
      return res.status(403).json({ 
        message: "LIMIT_REACHED", 
        detail: `You have reached the limit of ${limit} active jobs for the ${userPlan} plan. Please upgrade to post more.` 
      });
    }

    
    const job = await Job.create({ ...req.body, company: req.user._id });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getJobs = async (req, res) => {
  const { keyword, location, category, type, minSalary, maxSalary, userId } = req.query;

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
    const jobs = await Job.find(query).populate("company", "name companyName companyLogo location").sort({ createdAt: -1 });

    let savedJobsIds = [];
    let appliedJobStatusMap = {};

    if (userId && userId !== "undefined") {
      const savedJobs = await SavedJob.find({ jobseeker: userId }).select("job");
      savedJobsIds = savedJobs.map((sj) => sj.job.toString());

      const applications = await Application.find({ applicant: userId }).select("job status");
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
    const job = await Job.findById(req.params.id).populate("company", "name companyName companyLogo companyDescription email");
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
    const jobs = await Job.find({ company: req.user._id }).sort({ createdAt: -1 }).lean();
    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ job: job._id });
        return {
          ...job,
          applicationsCount: count,
        };
      })
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
      return res.status(401).json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
      return res.status(401).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
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
    res.status(200).json({ message: `Job is now ${job.isClosed ? "Closed" : "Open"}`, isClosed: job.isClosed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
