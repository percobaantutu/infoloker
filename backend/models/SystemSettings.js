const mongoose = require("mongoose");

const systemSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "Infoloker" },
    supportEmail: { type: String, default: "support@infoloker.com" },
    
    // Toggles
    maintenanceMode: { type: Boolean, default: false },
    allowRegistrations: { type: Boolean, default: true },
    allowJobPosting: { type: Boolean, default: true },
    
    // Announcement Banner (Top of site)
    announcement: {
      active: { type: Boolean, default: false },
      message: { type: String, default: "" },
      type: { type: String, enum: ["info", "warning", "error"], default: "info" }
    }
  },
  { timestamps: true }
);

systemSettingsSchema.statics.getSettings = async function() {
  const settings = await this.findOne();
  if (settings) return settings;
  return await this.create({});
};

module.exports = mongoose.model("SystemSettings", systemSettingsSchema);