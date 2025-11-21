const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
  {
    // Reference to the jobseeker who saved the job
    jobseeker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Reference to the job that was saved
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavedJob", savedJobSchema);
