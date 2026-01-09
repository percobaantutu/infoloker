const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // Reference to the Job the user applied for
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },

    // Reference to the User (Job Seeker) who applied
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Link or path to the applicant's resume
    resume: { type: String }, // can store uploaded version or link

    // Application status tracker
    status: {
      type: String,
      enum: ["Applied", "In Review", "Rejected", "Accepted", "Interview"],
      default: "Applied",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
