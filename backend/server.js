require("dotenv").config(); 
const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const { globalLimiter } = require("./middleware/rateLimitMiddleware");

const authRoute = require("./route/authRoute");
const userRoute = require("./route/userRoute");
const jobRoute = require("./route/jobRoute");
const applicationRoute = require("./route/applicationRoute");
const savedJobRoute = require("./route/savedJobRoute");
const analyticsRoute = require("./route/analyticsRoute");
const notificationRoute = require("./route/notificationRoute");
const adminDashboardRoute = require("./route/admin/dashboardRoute");
const articleRoute = require("./route/articleRoute");
const userManagementRoute = require("./route/admin/userManagementRoute");
const adminJobRoute = require("./route/admin/jobManagementRoute");
const subscriptionRoute = require("./route/subscriptionRoute");
const adminSubscriptionRoute = require("./route/admin/subscriptionManagementRoute");
const adminSettingsRoute = require("./route/admin/settingsRoute");
const { checkMaintenance } = require("./middleware/maintenanceMiddleware");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://app.sandbox.midtrans.com", 
          "https://app.midtrans.com",         
          "https://accounts.google.com",      
        ],
        connectSrc: [
          "'self'",
          "http://localhost:8000",
          "https://app.sandbox.midtrans.com",
          "https://app.midtrans.com",
          "https://accounts.google.com",
          "https://api.cloudinary.com",
        ],
        frameSrc: [
          "'self'",
          "https://app.sandbox.midtrans.com",
          "https://app.midtrans.com",
          "https://accounts.google.com",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://res.cloudinary.com",      
        ],
      },
    },
  crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    
  })
);

app.use(express.json({ limit: "1mb" })); 

const sanitizeData = (obj) => {
  if (obj instanceof Object) {
    for (const key in obj) {
      // If a key starts with $ (Mongo Injection) or contains a .
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else {
        // Recursively check nested objects
        sanitizeData(obj[key]);
      }
    }
  }
  return obj;
};

// 2. Custom Middleware to use the sanitizer
app.use((req, res, next) => {
  if (req.body) sanitizeData(req.body);
  if (req.params) sanitizeData(req.params);
  if (req.query) sanitizeData(req.query);
  next();
});



app.use(hpp());








connectDB(); 


app.use(express.json());

app.use("/api", globalLimiter);


app.use("/api/auth", authRoute); 

app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

app.use("/api/users", userRoute);
app.use("/api/jobs", jobRoute);
app.use("/api/applications", applicationRoute);
app.use("/api/save-jobs", savedJobRoute);
app.use("/api/analytics", analyticsRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/admin/dashboard", adminDashboardRoute);
app.use("/api/articles", articleRoute);
app.use("/api/admin/users", userManagementRoute);
app.use("/api/admin/jobs", adminJobRoute);
app.use("/api/subscriptions", subscriptionRoute);
app.use("/api/admin/subscriptions", adminSubscriptionRoute);
app.use("/api/admin/settings", adminSettingsRoute);
app.use("/api", checkMaintenance);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
