const SystemSettings = require("../models/SystemSettings");

const checkMaintenance = async (req, res, next) => {
  try {
    // 1. Get Settings
    const settings = await SystemSettings.getSettings();

    // 2. If Maintenance is OFF, continue
    if (!settings.maintenanceMode) {
      return next();
    }

    // 3. If Maintenance is ON, allow Admins only
    // (We need to verify the token manually here or allow specific routes like /login)
    
    // Allow Auth routes so Admins can login
    if (req.path.startsWith("/api/auth")) {
      return next();
    }

    // Check if user is logged in AND is Admin (requires authMiddleware to run BEFORE this)
    // Alternatively, just block everything else with a 503 Service Unavailable
    if (req.user && req.user.role === "admin") {
      return next();
    }

    // BLOCK EVERYONE ELSE
    return res.status(503).json({ 
      message: "System is currently under maintenance. Please try again later." 
    });

  } catch (error) {
    next();
  }
};

module.exports = { checkMaintenance };