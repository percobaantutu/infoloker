const Article = require("../../models/Article");
const User = require("../../models/User");
const sanitizeHtml = require('sanitize-html');

const sanitizeOptions = {

  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'span', 'iframe']),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    '*': ['style', 'class', 'id'],
    'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
    'img': ['src', 'alt', 'width', 'height']
  }
};

// @desc    Create new article
// @route   POST /api/articles
// @access  Private (Admin)
exports.createArticle = async (req, res) => {
  try {
     if (req.body.content) {
      req.body.content = sanitizeHtml(req.body.content, sanitizeOptions);
    }
    const { title, excerpt, content, category, tags, status, readTime } = req.body;

    // Handle Cover Image
    let coverImage = "";
    if (req.file && req.file.path) {
      coverImage = req.file.path;
    }

    // Auto-calculate read time if not provided (approx 200 words/min)
    let finalReadTime = readTime;
    if (!finalReadTime && content) {
      const wordCount = content.split(/\s+/).length;
      finalReadTime = Math.ceil(wordCount / 200);
    }

    const article = await Article.create({
      title,
      excerpt,
      content,
      coverImage,
      category,
      tags: tags ? tags.split(",").map(t => t.trim()) : [], // Handle CSV tags
      status: status || "draft",
      readTime: finalReadTime,
      author: req.user._id,
      publishedAt: status === "published" ? Date.now() : null
    });

    res.status(201).json(article);
  } catch (error) {
    console.error("Create Article Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all articles (Admin: All / Public: Published only)
// @route   GET /api/articles
// @access  Public / Private
exports.getArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, category } = req.query;
    
    // Build Query
    const query = {};
    
  
    
    if (status) query.status = status;
    if (category) query.category = category;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }

    const articles = await Article.find(query)
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Article.countDocuments(query);

    res.json({
      articles,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalArticles: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single article by Slug
// @route   GET /api/articles/:slug
// @access  Public
exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug })
      .populate("author", "name avatar authorProfile");

    if (!article) return res.status(404).json({ message: "Article not found" });

    // Increment views
    article.views += 1;
    await article.save();

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private (Admin)
exports.updateArticle = async (req, res) => {
  try {
     if (req.body.content) {
      req.body.content = sanitizeHtml(req.body.content, sanitizeOptions);
    }
    let article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    // Handle Image Update
    if (req.file && req.file.path) {
      req.body.coverImage = req.file.path;
    }

    // Handle Tags
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(",").map(t => t.trim());
    }

    // Update published date if switching to published
    if (req.body.status === "published" && article.status !== "published") {
      req.body.publishedAt = Date.now();
    }

    article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private (Admin)
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    await article.deleteOne();
    res.json({ message: "Article removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    
    res.status(200).json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Server error" });
  }
};