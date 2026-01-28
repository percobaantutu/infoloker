const express = require("express");
const { createTransaction, midtransWebhook } = require("../controllers/premium/subscriptionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Private: User initiates payment
router.post("/create-transaction", protect, createTransaction);

// Public: Midtrans calls this (Must be public!)
router.post("/webhook", midtransWebhook);

module.exports = router;