const Job = require("../models/Job");
const Application = require("../models/Application");

const getTrend = (current, previous) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 100);
};

exports.getAnalytics = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const companyId = req.user._id;
    const now = new Date();
    const last7Days = new Date(now);
    last7Days.setDate(now.getDate() - 7);
    const previous7Days = new Date(now);
    previous7Days.setDate(now.getDate() - 14);

    // 1. COUNTS
    // Note: Usually "Total Jobs" includes closed ones too.
    // If you only want active, keep 'isClosed: false'.
    // If you want history, remove it.
    const totalJobs = await Job.countDocuments({ company: companyId, isClosed: false });

    // Get all job IDs to find related applications
    const jobs = await Job.find({ company: companyId }).select("_id").lean();
    const jobIds = jobs.map((job) => job._id);

    const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
    const totalHired = await Application.countDocuments({ job: { $in: jobIds }, status: "Accepted" });

    // 2. TRENDS (Active Jobs)
    const activeJobsLast7 = await Job.countDocuments({
      company: companyId,
      createdAt: { $gte: last7Days, $lte: now },
    });

    const activeJobsPrevious7 = await Job.countDocuments({
      company: companyId,
      createdAt: { $gte: previous7Days, $lt: last7Days },
    });

    const activeJobsTrend = getTrend(activeJobsLast7, activeJobsPrevious7);

    // 3. TRENDS (Applications)
    const applicationsLast7 = await Application.countDocuments({
      job: { $in: jobIds },
      createdAt: { $gte: last7Days, $lte: now },
    });

    const applicationsPrevious7 = await Application.countDocuments({
      job: { $in: jobIds },
      createdAt: { $gte: previous7Days, $lt: last7Days },
    });

    const applicantTrend = getTrend(applicationsLast7, applicationsPrevious7);

    // 4. TRENDS (Hired)
    const hiredLast7 = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Accepted",
      createdAt: { $gte: last7Days, $lte: now },
    });

    const hiredPrevious7 = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Accepted",
      createdAt: { $gte: previous7Days, $lt: last7Days },
    });

    const hiredTrend = getTrend(hiredLast7, hiredPrevious7);

    // 5. RECENT DATA
    const recentJobs = await Job.find({ company: companyId }).sort({ createdAt: -1 }).limit(5).select("title createdAt isClosed");

    const recentApplications = await Application.find({ job: { $in: jobIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("applicant", "name email avatar")
      .populate("job", "title");

    // 6. RESPONSE
    res.json({
      counts: {
        totalJobs,
        totalApplications,
        totalHired,
        trends: {
          activeJobs: activeJobsTrend,
          totalApplicants: applicantTrend,
          totalHired: hiredTrend,
        },
      },
      data: {
        recentJobs,
        recentApplications,
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error); // Added log for debugging
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
