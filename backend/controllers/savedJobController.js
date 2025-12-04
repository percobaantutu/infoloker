const SavedJob = require("../models/SavedJob");

exports.saveJob = async (req, res) => {
  try {
    const exists = await SavedJob.findOne({ job: req.params.jobId, jobseeker: req.user.id });
    if (exists) return res.status(400).json({ message: "Job already saved" });
    const savedJob = await SavedJob.create({
      job: req.params.jobId,
      jobseeker: req.user.id,
    });
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: "Failed to save job", error: error.message });
  }
};

exports.removeSavedJob = async (req, res) => {
  try {
    await SavedJob.findOneAndDelete({ job: req.params.jobId, jobseeker: req.user.id });
    res.status(200).json({ message: "Job unsaved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to unsave job", error: error.message });
  }
};

exports.getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ jobseeker: req.user.id }).populate({
      path: "job",
      populate: { path: "company", select: "name companyName companyLogo" },
    });
    res.status(200).json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to get saved jobs", error: error.message });
  }
};
