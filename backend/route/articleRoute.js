const express = require("express");
const { 
  createArticle, 
  getArticles, 
  getArticleBySlug, 
  updateArticle,
  getArticleById, 
  deleteArticle 
} = require("../controllers/article/articleController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminAuthMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public Routes
router.get("/", getArticles);
router.get("/slug/:slug", getArticleBySlug);

// Admin Routes
router.get("/:id", protect, adminOnly, getArticleById);
router.post("/", protect, adminOnly, upload.single("coverImage"), createArticle);
router.put("/:id", protect, adminOnly, upload.single("coverImage"), updateArticle);
router.delete("/:id", protect, adminOnly, deleteArticle);

module.exports = router;