const express = require("express");
const { createTransaction, midtransWebhook,  getAllSubscriptions, 
  getRevenueStats } = require("../controllers/premium/subscriptionController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");
const { subscriptionSchema } = require("../validators/subscriptionValidator");

const router = express.Router();


router.post(
  "/create-transaction", 
  protect, 
  validate(subscriptionSchema), 
  createTransaction
);


router.post("/webhook", midtransWebhook);

// enable add admin-specific validation here if needed later)
router.get("/admin/all", protect, getAllSubscriptions);
router.get("/admin/revenue", protect, getRevenueStats);

module.exports = router;