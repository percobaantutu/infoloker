const multer = require("multer");

// Configure storage
const storage = multer.diskStorage({
  // Destination specifies where the file should be saved on the disk
  destination: (req, file, cb) => {
    // cb(error, destination_path)
    cb(null, "./uploads/");
  },

  // Filename specifies how the file should be named
  filename: (req, file, cb) => {
    // Prepend the current timestamp to the original filename to prevent collisions
    cb(null, `${Date.now()}-${file.originalname}`);
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
