const rateLimit = require("express-rate-limit");


exports.globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 150, 
  standardHeaders: true, 
  legacyHeaders: false, 
  message: { 
    message: "Too many requests from this IP, please try again after 15 minutes" 
  },
});


exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    message: "Too many login/register attempts, please try again after 15 minutes" 
  },
});