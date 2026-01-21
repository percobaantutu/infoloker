const User = require("../../models/User");

// @desc    Get all users (with pagination, search, filters)
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;

    // 1. Build Query
    const query = {};

    // Search by Name or Email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by Role
    if (role && role !== "All") {
      query.role = role.toLowerCase();
    }

    // Filter by Status (Active/Suspended)
    if (status && status !== "All") {
      query.isActive = status === "Active";
    }

    // 2. Execute Query
    const users = await User.find(query)
      .select("-password") // Don't send passwords
      .sort({ createdAt: -1 }) // Newest first
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalUsers: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Suspend/Activate User
// @route   PUT /api/admin/users/:id/suspend
// @access  Private (Admin)
exports.suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot suspend your own account" });
    }

    // Toggle Status
    user.isActive = !user.isActive;
    
    // Optional: Log suspension details
    if (!user.isActive) {
        user.suspendedAt = Date.now();
        user.suspensionReason = "Admin action"; // Could come from req.body
    } else {
        user.suspendedAt = null;
        user.suspensionReason = null;
    }

    await user.save();

    res.json({ 
        message: `User ${user.isActive ? "activated" : "suspended"} successfully`, 
        user 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete User
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }


    if (user.role === 'admin' && req.user.role !== 'admin') { 
       
    }

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};