/**
 * Generates an HTML email template for subscription confirmation
 * @param {Object} options - Template options
 * @param {string} options.userName - Employer's name
 * @param {string} options.planName - Name of the plan (Basic, Premium, Enterprise)
 * @param {number} options.amount - Amount paid in IDR
 * @param {Date} options.startDate - Subscription start date
 * @param {Date} options.endDate - Subscription end date
 * @param {number} options.durationInDays - Duration of the subscription
 * @returns {string} HTML email content
 */
const generateSubscriptionEmailTemplate = ({
  userName,
  planName,
  amount,
  startDate,
  endDate,
  durationInDays,
}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Plan-specific colors
  const planColors = {
    basic: {
      primary: "#3B82F6",
      gradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
    },
    premium: {
      primary: "#F59E0B",
      gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    },
    enterprise: {
      primary: "#8B5CF6",
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
    },
  };

  const colors = planColors[planName.toLowerCase()] || planColors.basic;

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Confirmation - Infoloker</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F3F4F6;">
  <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    
    <!-- Header -->
    <tr>
      <td style="background: ${colors.gradient}; padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
          🎉 Selamat!
        </h1>
        <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
          Langganan Anda telah aktif
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
          Terima kasih telah berlangganan <strong style="color: ${colors.primary};">${planName} Plan</strong> di Infoloker! Pembayaran Anda telah berhasil diproses.
        </p>

        <!-- Plan Details Card -->
        <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="background-color: #F9FAFB; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="padding: 24px;">
              <h3 style="margin: 0 0 16px; color: #111827; font-size: 18px; font-weight: 600;">
                Detail Langganan
              </h3>
              
              <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                <tr>
                  <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Paket</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">
                    ${planName} Plan
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Total Pembayaran</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">
                    ${formatCurrency(amount)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Durasi</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">
                    ${durationInDays} Hari
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Mulai</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">
                    ${formatDate(startDate)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Berakhir</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">
                    ${formatDate(endDate)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Benefits Section -->
        <div style="margin-top: 30px;">
          <h3 style="margin: 0 0 16px; color: #111827; font-size: 18px; font-weight: 600;">
            ✨ Fitur Premium Anda
          </h3>
          <ul style="margin: 0; padding: 0 0 0 20px; color: #374151; font-size: 14px; line-height: 2;">
            <li>Posting lowongan tanpa batas</li>
            <li>Badge Premium di profil perusahaan</li>
            <li>Prioritas tampil di pencarian</li>
            <li>Akses ke fitur analytics lanjutan</li>
            <li>Dukungan pelanggan prioritas</li>
          </ul>
        </div>

        <!-- CTA Button -->
        <div style="margin-top: 30px; text-align: center;">
          <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/employer/dashboard" 
             style="display: inline-block; padding: 14px 32px; background: ${colors.gradient}; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
            Mulai Posting Lowongan
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
        <p style="margin: 0 0 10px; color: #6B7280; font-size: 14px;">
          Butuh bantuan? Hubungi kami di
        </p>
        <a href="mailto:support@infoloker.com" style="color: ${colors.primary}; text-decoration: none; font-weight: 500;">
          support@infoloker.com
        </a>
        <p style="margin: 20px 0 0; color: #9CA3AF; font-size: 12px;">
          © ${new Date().getFullYear()} Infoloker. All rights reserved.
        </p>
      </td>
    </tr>

  </table>
</body>
</html>
  `.trim();
};

module.exports = generateSubscriptionEmailTemplate;
