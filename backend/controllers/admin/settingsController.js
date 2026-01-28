const SystemSettings = require("../../models/SystemSettings");

// @desc    Get System Settings
// @route   GET /api/admin/settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Settings
// @route   PUT /api/admin/settings
exports.updateSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    
    // Update fields
    Object.assign(settings, req.body);
    
    await settings.save();
    res.json({ message: "Settings updated", settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};