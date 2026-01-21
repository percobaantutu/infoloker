const User = require("../../models/User");
const Job = require("../../models/Job");
const Application = require("../../models/Application");
const Article = require("../../models/Article");

// @desc    Get admin dashboard overview
// @route   GET /api/admin/dashboard/overview
// @access  Private (Admin only)
exports.getDashboardOverview = async (req, res) => {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Parallel queries for performance
    const [
      totalUsers,
      newUsersToday,
      totalJobs,
      activeJobs,
      totalApplications,
      totalArticles
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ createdAt: { $gte: yesterday }, isActive: true }),
      Job.countDocuments(),
      Job.countDocuments({ isClosed: false }),
      Application.countDocuments(),
      Article.countDocuments()
    ]);

    // Recent activities (Last 5 users)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email role createdAt avatar");

    res.json({
      summary: {
        users: {
          total: totalUsers,
          newToday: newUsersToday,
        },
        jobs: {
          total: totalJobs,
          active: activeJobs,
        },
        applications: {
          total: totalApplications,
        },
        articles: {
          total: totalArticles,
        }
      },
      recentUsers
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ 
      message: "Failed to load dashboard data",
      error: error.message 
    });
  }
};