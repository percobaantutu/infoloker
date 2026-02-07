require("dotenv").config();
const midtransClient = require("midtrans-client");
const Subscription = require("../../models/Subscription");
const User = require("../../models/User");
const sendEmail = require("../../utils/sendEmail");
const generateSubscriptionEmailTemplate = require("../../utils/subscriptionEmailTemplate");

// Initialize Core API
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

const PLANS = {
  basic: { price: 39000, durationInDays: 30, name: "Basic Plan" },
  premium: { price: 89000, durationInDays: 30, name: "Premium Plan" },
  enterprise: { price: 123000, durationInDays: 365, name: "Enterprise Plan" },
};

// @desc    Create Payment Transaction
// @route   POST /api/subscriptions/create-transaction
exports.createTransaction = async (req, res) => {
  try {
    const { planType } = req.body;
    const selectedPlan = PLANS[planType];

    if (!selectedPlan) {
      return res.status(400).json({ message: "Invalid plan type" });
    }

    // 1. Generate unique Order ID
    const orderId = `SUB-${req.user._id}-${Date.now()}`;

    // 2. Prepare Parameter for Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: selectedPlan.price,
      },
      customer_details: {
        first_name: req.user.name,
        email: req.user.email,
      },
      item_details: [
        {
          id: planType,
          price: selectedPlan.price,
          quantity: 1,
          name: selectedPlan.name,
        },
      ],
    };

    // 3. Create Transaction in Midtrans
    const transaction = await snap.createTransaction(parameter);

    // 4. Save Pending Subscription to DB
    await Subscription.create({
      user: req.user._id,
      planType,
      amount: selectedPlan.price,
      orderId,
      status: "pending",
    });

    // 5. Return the Token to Frontend
    res.json({ token: transaction.token, redirectUrl: transaction.redirect_url });

  } catch (error) {
    console.error("Midtrans Error:", error);
    res.status(500).json({ message: "Payment initiation failed", error: error.message });
  }
};

// @desc    Handle Midtrans Webhook (Notification)
// @route   POST /api/subscriptions/webhook
// @access  Public (Called by Midtrans Server)
exports.midtransWebhook = async (req, res) => {
  try {
    const notification = req.body;
    
    // 1. Verify status
    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    console.log(`Webhook received: ${orderId} - ${transactionStatus}`);

    // 2. Find Subscription
    const subscription = await Subscription.findOne({ orderId });
    if (!subscription) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 3. Update Status based on Midtrans response
    let newStatus = "pending";

    if (transactionStatus == "capture") {
      if (fraudStatus == "challenge") {
        newStatus = "challenge"; // Credit card pending review
      } else if (fraudStatus == "accept") {
        newStatus = "active";
      }
    } else if (transactionStatus == "settlement") {
      newStatus = "active";
    } else if (transactionStatus == "cancel" || transactionStatus == "deny" || transactionStatus == "expire") {
      newStatus = "failed";
    } else if (transactionStatus == "pending") {
      newStatus = "pending";
    }

    // 4. If Active, Activate User Features
    if (newStatus === "active" && subscription.status !== "active") {
      const planDetails = PLANS[subscription.planType];
      
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + planDetails.durationInDays);

      subscription.status = "active";
      subscription.startDate = startDate;
      subscription.endDate = endDate;
      subscription.paymentDate = new Date();

      await subscription.save();

      // Update User Profile
      const user = await User.findByIdAndUpdate(
        subscription.user, 
        { plan: subscription.planType },
        { new: true }
      );

      // Send confirmation email
      if (user && user.email) {
        try {
          const emailHtml = generateSubscriptionEmailTemplate({
            userName: user.name || user.companyName || "Employer",
            planName: planDetails.name.replace(" Plan", ""),
            amount: subscription.amount,
            startDate: startDate,
            endDate: endDate,
            durationInDays: planDetails.durationInDays
          });

          await sendEmail({
            email: user.email,
            subject: `🎉 Langganan ${planDetails.name} Anda Telah Aktif! - Infoloker`,
            message: `Terima kasih telah berlangganan ${planDetails.name}. Langganan Anda aktif hingga ${endDate.toLocaleDateString('id-ID')}.`,
            html: emailHtml
          });

          console.log(`Confirmation email sent to ${user.email}`);
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError);
          // Don't fail the webhook if email fails
        }
      }

      console.log(`Subscription activated for ${subscription.user}`);
    } else if (newStatus === "failed") {
      subscription.status = "failed";
      await subscription.save();
    }

    res.status(200).json({ status: "OK" });
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).json({ message: "Webhook failed" });
  }
};

// @desc    Get all subscriptions (Admin)
// @route   GET /api/admin/subscriptions
exports.getAllSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const query = {};

    if (status && status !== "All") {
      query.status = status.toLowerCase();
    }

    // Search by Order ID
    if (search) {
      query.orderId = { $regex: search, $options: "i" };
    }

    const subscriptions = await Subscription.find(query)
      .populate("user", "name email companyName")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Subscription.countDocuments(query);

    res.json({
      subscriptions,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Revenue Stats (Admin)
// @route   GET /api/admin/revenue
exports.getRevenueStats = async (req, res) => {
  try {
    const stats = await Subscription.aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalActiveSubs: { $sum: 1 },
          avgRevenue: { $avg: "$amount" }
        }
      }
    ]);

    res.json(stats[0] || { totalRevenue: 0, totalActiveSubs: 0, avgRevenue: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};