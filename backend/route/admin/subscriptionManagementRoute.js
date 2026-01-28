const express = require("express");
const { getAllSubscriptions, getRevenueStats } = require("../../controllers/premium/subscriptionController");
const { protect } = require("../../middleware/authMiddleware");
const { adminOnly } = require("../../middleware/adminAuthMiddleware");

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get("/", getAllSubscriptions);
router.get("/stats", getRevenueStats);

module.exports = router;