const express = require("express");
const { getNotifications, markAsRead, streamNotifications } = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");



const router = express.Router();

router.get("/", protect, getNotifications);
router.get("/stream", protect, streamNotifications);
router.put("/read", protect, markAsRead);

module.exports = router;