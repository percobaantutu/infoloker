const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    // Plan Details
    planType: { 
      type: String, 
      enum: ["basic", "premium", "enterprise"], 
      required: true 
    },
    amount: { type: Number, required: true },
    
    // Midtrans Data
    orderId: { type: String, required: true, unique: true }, // e.g., SUB-12345-TIMESTAMP
    status: {
      type: String,
      enum: ["pending", "active", "failed", "expired"],
      default: "pending",
    },
    
    // Dates
    startDate: Date,
    endDate: Date,
    paymentDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);