const User = require("../../models/User");
const Job = require("../../models/Job");
const Application = require("../../models/Application");
const Article = require("../../models/Article");
const Subscription = require("../../models/Subscription");

exports.getDashboardOverview = async (req, res) => {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Get date 30 days ago for chart limits
    const last30Days = new Date(today);
    last30Days.setDate(today.getDate() - 30);

    // 1. Fetch Totals (Existing Logic)
    const [
      totalUsers, newUsersToday, totalJobs, activeJobs,
      totalApplications, totalArticles, revenueStats
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ createdAt: { $gte: yesterday }, isActive: true }),
      Job.countDocuments(),
      Job.countDocuments({ isClosed: false }),
      Application.countDocuments(),
      Article.countDocuments(),
      Subscription.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    // 2. Fetch Chart Data (NEW LOGIC)
    // A. User Growth by Day (Last 30 Days)
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: last30Days } } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { _id: 1 } } // Sort by date ascending
    ]);

    // B. Application Trend by Day
    const applicationTrend = await Application.aggregate([
      { $match: { createdAt: { $gte: last30Days } } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { _id: 1 } }
    ]);

    // C. Revenue by Day
    const revenueTrend = await Subscription.aggregate([
      { $match: { createdAt: { $gte: last30Days }, status: "active" } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
          total: { $sum: "$amount" } 
        } 
      },
      { $sort: { _id: 1 } }
    ]);

    // 3. Fetch Recent Users (Existing Logic)
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("name email role createdAt avatar");

    res.json({
      summary: {
        users: { total: totalUsers, newToday: newUsersToday },
        jobs: { total: totalJobs, active: activeJobs },
        applications: { total: totalApplications },
        articles: { total: totalArticles },
        revenue: { total: revenueStats[0]?.total || 0 }
      },
      
      charts: {
        userGrowth: userGrowth.map(item => ({ date: item._id, value: item.count })),
        applicationTrend: applicationTrend.map(item => ({ date: item._id, value: item.count })),
        revenueTrend: revenueTrend.map(item => ({ date: item._id, value: item.total }))
      },
      recentUsers
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};