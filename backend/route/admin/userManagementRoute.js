const express = require("express");
const { getAllUsers, suspendUser, deleteUser } = require("../../controllers/admin/userManagementController");
const { protect } = require("../../middleware/authMiddleware");
const { adminOnly } = require("../../middleware/adminAuthMiddleware");

const router = express.Router();

// Apply global protection for this route group
router.use(protect);
router.use(adminOnly);

router.get("/", getAllUsers);
router.put("/:id/suspend", suspendUser);
router.delete("/:id", deleteUser);

module.exports = router;