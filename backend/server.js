require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoute = require("./route/authRoute");
const userRoute = require("./route/userRoute");
const jobRoute = require("./route/jobRoute");
const applicationRoute = require("./route/applicationRoute");

const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: "*", // Allows requests from any domain (for development)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect Database
connectDB(); // Assumed function call

// Middleware to parse JSON in request body
app.use(express.json());

// Routes
app.use("/api/auth", authRoute); // Attaches authRoutes to the base URL /api/auth

// serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

app.use("/api/users", userRoute);
app.use("/api/jobs", jobRoute);
app.use("/api/applications", applicationRoute); // Assumed path

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
