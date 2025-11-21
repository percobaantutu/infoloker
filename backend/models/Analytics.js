const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    // Reference to the User (Employer) whose analytics this record tracks
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Key performance indicators (KPIs)
    totalJobsPosted: { type: Number, default: 0 },
    totalApplicationsReceived: { type: Number, default: 0 },
    totalHired: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analytics", analyticsSchema);
