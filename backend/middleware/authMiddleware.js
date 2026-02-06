const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assumes path to User model

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization; // Get authorization header

    // 1. Check for token in header (Bearer format) or query param (for SSE)
    if (token && token.startsWith("Bearer")) {
      // Extract the actual token string (removes "Bearer ")
      token = token.split(" ")[1];
    } else if (req.query.token) {
      // SSE connections pass token via query param (EventSource doesn't support headers)
      token = req.query.token;
    }

    if (token) {
      // 2. Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the user by the ID stored in the token and attach to request
      // .select("-password") prevents the hashed password from being attached
      req.user = await User.findById(decoded.id).select("-password");

      // 4. Continue to the next middleware or route handler
      next();
    } else {
      // If no token is found
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    // If token verification fails (e.g., expired or invalid signature)
    res.status(401).json({ message: "Token failed", error: error.message });
  }
};

module.exports = { protect };
