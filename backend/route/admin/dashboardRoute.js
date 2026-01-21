const express = require("express");
const { getDashboardOverview } = require("../../controllers/admin/dashboardController");
const { protect } = require("../../middleware/authMiddleware");
const { adminOnly } = require("../../middleware/adminAuthMiddleware");

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get("/overview", getDashboardOverview);

module.exports = router;