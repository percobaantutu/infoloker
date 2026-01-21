const mongoose = require("mongoose");

const adminActivitySchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type: String, required: true, index: true },
  targetModel: { type: String },
  targetId: mongoose.Schema.Types.ObjectId,
  details: mongoose.Schema.Types.Mixed,
  ipAddress: String,
}, { timestamps: true });

module.exports = mongoose.model("AdminActivity", adminActivitySchema);