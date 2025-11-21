const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "60d" });
};

// @desc Register new user
exports.register = async (req, res) => {
  try {
    // Destructure required data from the request body
    const { name, email, password, avatar, role } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Create the new user (password is automatically hashed by the schema pre-save hook)
    const user = await User.create({ name, email, password, role, avatar });

    // 3. Respond with the new user's data and a JWT token
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,

        // Generate and send the authentication token
        token: generateToken(user._id),

        // Include employer-specific fields, defaulting to empty string if not present
        companyName: user.companyName || "",
        companyDescription: user.companyDescription || "",
        companyLogo: user.companyLogo || "",

        // Include jobseeker-specific field
        resume: user.resume || "",
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
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

    // 3. Respond with user data and a new JWT token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
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
