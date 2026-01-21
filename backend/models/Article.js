const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 200, index: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  excerpt: { type: String, maxLength: 300, required: true },
  content: { type: String, required: true },
  coverImage: { type: String, required: true },
  
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  
  category: {
    type: String,
    enum: [
      'Career Tips', 'Interview Guide', 'Salary Guide', 'Industry News',
      'Company Culture', 'Resume Writing', 'Skill Development', 'Job Search Strategy'
    ],
    required: true,
    index: true
  },
  tags: [{ type: String, lowercase: true, trim: true }],
  
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true
  },
  publishedAt: { type: Date, index: true },
  
  views: { type: Number, default: 0, index: true },
  readTime: { type: Number, required: true }, 
  featured: { type: Boolean, default: false, index: true },
  
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, { timestamps: true });

articleSchema.pre('validate', async function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
      
   
  }
  next();
});

module.exports = mongoose.model("Article", articleSchema);