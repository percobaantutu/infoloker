/**
 * Subscription Scheduler
 * Runs scheduled jobs to handle subscription expiration
 */

const cron = require("node-cron");
const Subscription = require("../models/Subscription");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const {
  generateExpirationReminderTemplate,
  generateExpiredNotificationTemplate,
} = require("../utils/expirationEmailTemplates");

const PLAN_NAMES = {
  basic: "Basic Plan",
  premium: "Premium Plan",
  enterprise: "Enterprise Plan",
};

/**
 * Check and expire subscriptions that have passed their end date
 */
const expireSubscriptions = async () => {
  console.log("[Scheduler] Running subscription expiration check...");

  try {
    const now = new Date();

    // Find all active subscriptions that have expired
    const expiredSubscriptions = await Subscription.find({
      status: "active",
      endDate: { $lt: now },
    }).populate("user", "name email");

    console.log(`[Scheduler] Found ${expiredSubscriptions.length} expired subscriptions`);

    for (const subscription of expiredSubscriptions) {
      try {
        // 1. Update subscription status to expired
        subscription.status = "expired";
        await subscription.save();

        // 2. Downgrade user plan to free
        await User.findByIdAndUpdate(subscription.user._id, { plan: "free" });

        // 3. Send expiration notification email
        if (subscription.user?.email) {
          const emailHtml = generateExpiredNotificationTemplate({
            userName: subscription.user.name || "Employer",
            planName: PLAN_NAMES[subscription.planType] || subscription.planType,
          });

          await sendEmail({
            email: subscription.user.email,
            subject: "📋 Langganan Anda Telah Berakhir - Infoloker",
            message: `Langganan ${PLAN_NAMES[subscription.planType]} Anda telah berakhir. Akun Anda telah dikembalikan ke paket Free.`,
            html: emailHtml,
          });

          console.log(`[Scheduler] Expiration email sent to ${subscription.user.email}`);
        }

        console.log(`[Scheduler] Subscription ${subscription.orderId} expired and user downgraded`);
      } catch (err) {
        console.error(`[Scheduler] Error processing subscription ${subscription.orderId}:`, err);
      }
    }
  } catch (error) {
    console.error("[Scheduler] Error in expireSubscriptions:", error);
  }
};

/**
 * Send reminder emails for subscriptions expiring soon
 */
const sendExpirationReminders = async () => {
  console.log("[Scheduler] Running expiration reminder check...");

  try {
    const now = new Date();
    
    // Calculate dates for 3-day and 7-day reminders
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Find subscriptions expiring in 3 or 7 days
    const expiringSubscriptions = await Subscription.find({
      status: "active",
      endDate: {
        $gte: now,
        $lte: sevenDaysFromNow,
      },
    }).populate("user", "name email");

    console.log(`[Scheduler] Found ${expiringSubscriptions.length} subscriptions expiring soon`);

    for (const subscription of expiringSubscriptions) {
      try {
        const endDate = new Date(subscription.endDate);
        const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

        // Only send reminders at 7 days and 3 days before expiration
        if (daysLeft !== 3 && daysLeft !== 7) continue;

        if (subscription.user?.email) {
          const emailHtml = generateExpirationReminderTemplate({
            userName: subscription.user.name || "Employer",
            planName: PLAN_NAMES[subscription.planType] || subscription.planType,
            endDate: subscription.endDate,
            daysLeft: daysLeft,
          });

          await sendEmail({
            email: subscription.user.email,
            subject: `⏰ Langganan Anda Akan Berakhir dalam ${daysLeft} Hari - Infoloker`,
            message: `Langganan ${PLAN_NAMES[subscription.planType]} Anda akan berakhir dalam ${daysLeft} hari.`,
            html: emailHtml,
          });

          console.log(`[Scheduler] Reminder email sent to ${subscription.user.email} (${daysLeft} days left)`);
        }
      } catch (err) {
        console.error(`[Scheduler] Error sending reminder for ${subscription.orderId}:`, err);
      }
    }
  } catch (error) {
    console.error("[Scheduler] Error in sendExpirationReminders:", error);
  }
};

/**
 * Initialize all scheduled jobs
 */
const initializeScheduler = () => {
  console.log("[Scheduler] Initializing subscription scheduler...");

  // Run expiration check every hour
  // Cron format: minute hour day-of-month month day-of-week
  cron.schedule("0 * * * *", () => {
    expireSubscriptions();
  });

  // Run reminder check once a day at 9 AM
  cron.schedule("0 9 * * *", () => {
    sendExpirationReminders();
  });

  console.log("[Scheduler] Subscription scheduler initialized");
  console.log("[Scheduler] - Expiration check: Every hour");
  console.log("[Scheduler] - Reminder emails: Daily at 9 AM");

  // Run initial check on startup (after 10 seconds to let server fully start)
  setTimeout(() => {
    console.log("[Scheduler] Running initial expiration check...");
    expireSubscriptions();
  }, 10000);
};

module.exports = { initializeScheduler, expireSubscriptions, sendExpirationReminders };
