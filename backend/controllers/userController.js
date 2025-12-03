const User = require("../models/User");
const cloudinary = require("../config/cloudinary"); // Import Cloudinary config

// Helper to extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  try {
    // Splits url: ".../upload/v1234/infoloker-uploads/filename.jpg"
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
};

// @desc Update user profile
exports.updateProfile = async (req, res) => {
  try {
    console.log("🔍 REQUEST CONTENT-TYPE:", req.headers["content-type"]);
    console.log("🔍 REQ.BODY:", req.body);
    console.log("🔍 REQ.FILES:", req.files);
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, companyName, companyDescription } = req.body;

    // 1. Update Text Fields
    user.name = name || user.name;

    if (user.role === "employer") {
      user.companyName = companyName || user.companyName;
      user.companyDescription = companyDescription || user.companyDescription;
    }

    // 2. Handle File Uploads (Avatar & Company Logo & Resume)
    // req.files is used because we will use upload.fields() in the route
    if (req.files) {
      // Handle Avatar
      if (req.files.avatar) {
        // Optional: Delete old avatar from Cloudinary before saving new one
        if (user.avatar) {
          const publicId = getPublicIdFromUrl(user.avatar);
          if (publicId) await cloudinary.uploader.destroy(publicId);
        }
        user.avatar = req.files.avatar[0].path;
      }

      // Handle Company Logo
      if (req.files.companyLogo) {
        user.companyLogo = req.files.companyLogo[0].path;
      }

      // Handle Resume
      if (req.files.resume) {
        user.resume = req.files.resume[0].path;
      }
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      resume: user.resume,
      companyName: user.companyName,
      companyDescription: user.companyDescription,
      companyLogo: user.companyLogo,
    });
  } catch (err) {
    // --- DEBUGGING LOGS ---
    console.log("❌ ERROR OCCURRED IN UPDATE PROFILE");
    // This prints the error object as a readable string
    console.log("👇 ERROR DETAILS:", JSON.stringify(err, null, 2));

    // If it's a standard Error object, print the stack trace
    if (err.stack) console.log("👇 STACK TRACE:", err.stack);
    // ---------------------

    res.status(500).json({ message: err.message || "Server Error" });
  }
};

// @desc Delete resume
exports.deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "jobseeker") {
      return res.status(403).json({ message: "Only jobseekers can delete resume" });
    }

    // 1. Remove from Cloudinary
    if (user.resume) {
      const publicId = getPublicIdFromUrl(user.resume);
      if (publicId) {
        // 'resource_type: raw' might be needed for PDFs depending on how they were uploaded,
        // but usually 'image' covers standard uploads. If it fails for PDF, add { resource_type: 'raw' }
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // 2. Remove from Database
    user.resume = "";
    await user.save();

    res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get public profile
exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
