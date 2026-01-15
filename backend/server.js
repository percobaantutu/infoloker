require("dotenv").config(); 
const express = require("express");
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
const app = express();


app.use(
  cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
