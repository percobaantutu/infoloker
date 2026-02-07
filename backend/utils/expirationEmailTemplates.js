/**
 * Subscription Expiration Email Templates
 */

/**
 * Email template for subscription expiration reminder (sent before expiration)
 */
const generateExpirationReminderTemplate = ({ userName, planName, endDate, daysLeft }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Expiring Soon - Infoloker</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F3F4F6;">
  <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
          ⏰ Langganan Segera Berakhir
        </h1>
        <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
          ${daysLeft} hari lagi
        </p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 40px 30px;">
        <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
          Halo <strong>${userName}</strong>,
        </p>
        <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
          Langganan <strong style="color: #F59E0B;">${planName}</strong> Anda akan berakhir pada <strong>${formatDate(endDate)}</strong>.
        </p>

        <!-- Warning Box -->
        <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
          <p style="margin: 0; color: #92400E; font-size: 14px;">
            <strong>Perhatian:</strong> Setelah langganan berakhir, akun Anda akan kembali ke paket Free dengan batasan 1 lowongan aktif.
          </p>
        </div>

        <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
          Perpanjang sekarang untuk tetap menikmati semua fitur premium tanpa gangguan!
        </p>

        <!-- CTA Button -->
        <div style="text-align: center;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/pricing" 
             style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
            Perpanjang Langganan
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
        <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
          © ${new Date().getFullYear()} Infoloker. All rights reserved.
        </p>
      </td>
    </tr>

  </table>
</body>
</html>
  `.trim();
};

/**
 * Email template for subscription expired notification
 */
const generateExpiredNotificationTemplate = ({ userName, planName }) => {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Expired - Infoloker</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F3F4F6;">
  <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
          📋 Langganan Telah Berakhir
        </h1>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 40px 30px;">
        <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
          Halo <strong>${userName}</strong>,
        </p>
        <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
          Langganan <strong>${planName}</strong> Anda telah berakhir. Akun Anda sekarang kembali ke paket <strong>Free</strong>.
        </p>

        <!-- Info Box -->
        <div style="background-color: #FEE2E2; border-left: 4px solid #EF4444; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
          <p style="margin: 0; color: #991B1B; font-size: 14px;">
            <strong>Batasan Paket Free:</strong><br>
            • Maksimal 1 lowongan aktif<br>
            • Tidak ada badge premium<br>
            • Fitur analytics terbatas
          </p>
        </div>

        <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
          Upgrade kembali untuk mendapatkan akses penuh ke semua fitur premium!
        </p>

        <!-- CTA Button -->
        <div style="text-align: center;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/pricing" 
             style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
            Berlangganan Lagi
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
        <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
          © ${new Date().getFullYear()} Infoloker. All rights reserved.
        </p>
      </td>
    </tr>

  </table>
</body>
</html>
  `.trim();
};

module.exports = {
  generateExpirationReminderTemplate,
  generateExpiredNotificationTemplate
};
