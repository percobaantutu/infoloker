const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // async allows dynamic params
    return {
      folder: "infoloker_uploads",
      // "auto" lets Cloudinary decide if it's image, video, or raw (PDF)
      allowed_formats: ["jpg", "png", "jpeg", "pdf"],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

// File filter (limits accepted file types)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

  // Check if the file's MIME type is in the allowed list
  if (allowedTypes.includes(file.mimetype)) {
    // cb(error, boolean_result) -> null error, allow upload (true)
    cb(null, true);
  } else {
    // Reject the file with a specific error message
    cb(new Error("Only .jpeg, .jpg, .png, and .pdf formats are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
