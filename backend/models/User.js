const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["jobseeker", "employer", "admin", "author"], required: true },
    permissions: [{
      type: String,
      enum: [
        "*",
        'manage_users', 'manage_jobs', 'manage_articles', 
        'manage_applications', 'view_analytics', 'manage_settings', 
        'manage_payments', 'publish_articles', 'edit_all_articles'
      ]
    }],
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    suspendedAt: Date,
    suspensionReason: String,
    authorProfile: {
      bio: String,
      expertise: [String],
      articlesPublished: { type: Number, default: 0 }
    },
    plan: { type: String, enum: ["free", "basic", "premium"], default: "free" },


  
    avatar: String,
    resume: String,

   
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


userSchema.pre("save", async function (next) {

  if (!this.isModified("password")) return next();


  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.matchPassword = function (enteredPassword) {

  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {

  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");


  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);

module.exports = mongoose.model("User", userSchema);
