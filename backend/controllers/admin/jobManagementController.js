const Job = require("../../models/Job");

// @desc    Get all jobs (Admin view)
// @route   GET /api/admin/jobs
exports.getAllJobsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, company } = req.query;
    const query = {};

    // Search by Title
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Filter by Status (Active/Closed)
    if (status && status !== "All") {
      query.isClosed = status === "Closed";
    }

    // Filter by Specific Company (Optional, useful if clicking from User list)
    if (company) {
      query.company = company;
    }

    const jobs = await Job.find(query)
      .populate("company", "name companyName email") // Get employer details
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Job.countDocuments(query);

    res.json({
      jobs,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalJobs: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete Job (Force)
// @route   DELETE /api/admin/jobs/:id
exports.deleteJobAdmin = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Optional: Send email to employer explaining why
    
    await job.deleteOne();
    res.json({ message: "Job deleted by admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle Featured Status
// @route   PUT /api/admin/jobs/:id/feature
exports.toggleJobFeature = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Assuming you added isFeatured to the model in Phase 1 updates
    // If not, it will just add it dynamically to the doc
    job.isFeatured = !job.isFeatured;
    
    await job.save();
    res.json({ message: `Job ${job.isFeatured ? "featured" : "un-featured"}`, job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};