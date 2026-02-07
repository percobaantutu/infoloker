const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "60d" });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const allowedRoles = ["jobseeker", "employer"];
    if (role && !allowedRoles.includes(role)) {
      return res.status(403).json({ message: "You cannot register with this role." });
    }

    const finalRole = role || "jobseeker";

    let avatarUrl = "";
    if (req.file && req.file.path) {
      avatarUrl = req.file.path;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 1. Generate OTP
    const otp = generateOTP();
    const otpExpire = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes

    const user = await User.create({
      name,
      email,
      password,
      role: finalRole,
      avatar: avatarUrl,
      isVerified: false, 
      otp,
      otpExpire,
    });

    if (user) {
      // 2. Send OTP Email
      const message = `Your verification code is: ${otp}\n\nThis code expires in 10 minutes.`;
      
      try {
        await sendEmail({
          email: user.email,
          subject: "Verify Your Account - Infoloker",
          message,
        });
      } catch (emailError) {
        console.error("OTP Email Failed:", emailError);
        // We still return success for registration, user can resend OTP later
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified, // Frontend needs this to decide redirect
        token: generateToken(user._id),
      });
    }
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// @desc Verify Email with OTP
// @route POST /api/auth/verify-email
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if verified
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    // Check Expiration
    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Success: Verify User
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Email verified successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: true
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Resend OTP
// @route POST /api/auth/resend-otp
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account is already verified" });
    }

    // Generate New OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send Email
    await sendEmail({
      email: user.email,
      subject: "New Verification Code - Infoloker",
      message: `Your new verification code is: ${otp}`,
    });

    res.status(200).json({ message: "New OTP sent to your email" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login user
exports.login = async (req, res) => {
  try {
    // Destructure email and password from the request body
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email });

    // 2. Check if user exists OR if the password is valid
    // The user model's matchPassword method compares the provided password with the stored hash
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
  return res.status(403).json({ message: "Your account has been suspended. Contact support." });
}

    // 3. Respond with user data and a new JWT token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan || "free",
      token: generateToken(user._id),

      // Include optional fields, defaulting to an empty string if not present
      avatar: user.avatar || "",
      companyName: user.companyName || "",
      companyDescription: user.companyDescription || "",
      companyLogo: user.companyLogo || "",
      resume: user.resume || "",
    });
  } catch (err) {
    // Catches database or internal server errors
    res.status(500).json({ message: err.message });
  }
};

// @desc Get user data
exports.getMe = async (req, res) => {
  res.json(req.user);
};

exports.testEmail = async (req, res) => {
  try {
    await sendEmail({
      email: req.body.email, // We will send it to ourselves via Postman
      subject: "Infoloker Email Test",
      message: "Hello! If you see this, the email system is working perfectly.",
    });

    res.status(200).json({ success: true, message: "Email sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Email could not be sent", error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get Reset Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create Reset URL (Frontend URL)
    // NOTE: Change localhost:5173 to your actual frontend URL if different
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click the link below to reset your password:\n\n${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        message,
      });

      res.status(200).json({ success: true, data: "Email sent" });
    } catch (error) {
      // If email fails, reset the token fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:resetToken
exports.resetPassword = async (req, res) => {
  try {
    // 1. Get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    // 2. Find user with valid token and time not expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // 3. Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // 4. Save (middleware will hash the new password automatically)
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Login/Register with Google
// @route   POST /api/auth/google
exports.googleLogin = async (req, res) => {
  try {
    const { token, role } = req.body; // Role is optional (only needed for new users)

    // 1. Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    // 2. Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // --- USER EXISTS (LOGIN) ---
      // If user exists but used a different provider, just log them in
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan || "free",
        avatar: user.avatar,
        token: generateToken(user._id),
        // Add other fields needed for context
        companyName: user.companyName || "",
        companyLogo: user.companyLogo || "",
        resume: user.resume || "",
      });
    } else {
      // --- USER NEW (REGISTER) ---
      
      // Generate a random password (since they use Google)
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

      user = await User.create({
        name,
        email,
        password: randomPassword,
        role: role || "jobseeker", // Default to jobseeker if not specified
        avatar: picture,
        isVerified: true, // Google emails are already verified
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan || "free",
        avatar: user.avatar,
        token: generateToken(user._id),
        // Defaults for new user
        companyName: "",
        companyLogo: "",
        resume: "",
      });
    }
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(400).json({ message: "Google authentication failed" });
  }
};