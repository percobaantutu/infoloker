const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["jobseeker", "employer"], required: true },

    // Optional fields for all users
    avatar: String,
    resume: String, // Path to resume file (primarily for jobseekers)

    // Fields specific to employer role
    companyName: String,
    companyDescription: String,
    companyLogo: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
     isVerified: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpire: Date,
  },
  
  { timestamps: true }
);

// Encrypt password before save (Mongoose Pre-Save Hook)
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  // Hash the password with a cost factor of 10
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Match entered password (Schema Method)
userSchema.methods.matchPassword = function (enteredPassword) {
  // Compare the plaintext password with the stored hash
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // 1. Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // 2. Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 3. Set expire (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);

module.exports = mongoose.model("User", userSchema);
