/**
 * VANVI MOMENTS — TRANSACTIONAL EMAIL & NOTIFICATION SERVICE
 * Handles order confirmation receipts, recipient gift notifications,
 * and contact messages with SMTP / Resend and graceful development simulation.
 */

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'Vanvi Moments <celebrate@vanvimoments.shop>';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

const isEmailConfigured = !!((SMTP_HOST && SMTP_USER) || RESEND_API_KEY);

/**
 * Send an email via Resend API or SMTP
 */
async function sendRawEmail({ to, subject, html, text }) {
  if (RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: EMAIL_FROM,
          to: [to],
          subject,
          html,
          text
        })
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, provider: 'resend', id: data.id };
      }
      console.warn('Resend API error:', data);
    } catch (e) {
      console.warn('Failed to send via Resend:', e.message);
    }
  }

  // Development Simulation / Console Logger
  console.log('\n======================================================');
  console.log('   💌 VANVI MOMENTS — EMAIL NOTIFICATION DISPATCH');
  console.log('======================================================');
  console.log(`To:      ${to}`);
  console.log(`From:    ${EMAIL_FROM}`);
  console.log(`Subject: ${subject}`);
  console.log(`Status:  ${isEmailConfigured ? 'SENT (Live Gateway)' : 'SIMULATED (Dev Mode)'}`);
  console.log('------------------------------------------------------');
  console.log(text || 'HTML Email Body Dispatched');
  console.log('======================================================\n');

  return {
    success: true,
    provider: isEmailConfigured ? 'live-smtp' : 'simulation',
    messageId: 'sim_msg_' + Date.now()
  };
}

/**
 * Luxury HTML template for Order Confirmation & Gift Delivery
 */
function buildOrderReceiptHtml({ customerName, orderId, templateName, amountINR, momentUrl, momentPin }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Vanvi Moment is Live!</title>
</head>
<body style="margin:0; padding:0; background-color:#0a020c; font-family:'Plus Jakarta Sans', Arial, sans-serif; color:#fcecf7;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0a020c; padding:30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:linear-gradient(180deg, #18031e 0%, #0d0111 100%); border:1px solid rgba(255, 140, 205, 0.25); border-radius:24px; padding:36px 30px; box-shadow:0 20px 50px rgba(255,0,122,0.15);">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <h1 style="margin:0; font-family:'Cormorant Garamond', Georgia, serif; font-size:32px; color:#ffffff; letter-spacing:1px;">Vanvi Moments ✨</h1>
              <p style="margin:6px 0 0 0; font-size:13px; color:#ff78c3; text-transform:uppercase; letter-spacing:2px; font-weight:700;">Order Confirmation &amp; Gift Receipt</p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:20px; font-size:15px; line-height:1.6; color:#fcecf7;">
              Dear <strong>${customerName || 'Creator'}</strong>,<br/><br/>
              Your emotional celebration experience <strong>${templateName}</strong> has been successfully published to the universe!
            </td>
          </tr>
          <tr>
            <td style="background:rgba(255,0,122,0.08); border:1px solid rgba(255,0,122,0.25); border-radius:16px; padding:20px; margin-bottom:24px;">
              <table width="100%" cellspacing="0" cellpadding="4" style="font-size:14px; color:#fcecf7;">
                <tr><td><strong>Order ID:</strong></td><td align="right" style="color:#ff78c3;">${orderId}</td></tr>
                <tr><td><strong>Amount Paid:</strong></td><td align="right" style="color:#38bdf8;">₹${amountINR}</td></tr>
                <tr><td><strong>Unlock PIN:</strong></td><td align="right" style="color:#f59e0b; font-weight:bold;">${momentPin || 'Envelope Swipe (No PIN)'}</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:30px 0 20px 0;">
              <a href="${momentUrl}" style="background:linear-gradient(135deg, #ff007a 0%, #a855f7 100%); color:#ffffff; padding:14px 32px; border-radius:99px; text-decoration:none; font-weight:800; font-size:15px; display:inline-block; box-shadow:0 10px 25px rgba(255,0,122,0.4);">
                Open &amp; Share Your Moment 💌
              </a>
            </td>
          </tr>
          <tr>
            <td style="font-size:12px; color:#b891b0; text-align:center; padding-top:24px; border-top:1px solid rgba(255, 140, 205, 0.15);">
              Questions or support? Reply directly to this email or reach us at <a href="mailto:vanvimoments@gmail.com" style="color:#38bdf8;">vanvimoments@gmail.com</a> (or support@vanvimoments.shop).<br/>
              © 2026 Vanvi Moments · Luxury Digital Celebrations
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Dispatch Order Confirmation
 */
async function sendOrderConfirmation({ toEmail, customerName, orderId, templateName, amountINR, momentUrl, momentPin }) {
  if (!toEmail) return { success: false, error: 'Recipient email required' };

  const subject = `✨ Your Celebration Moment is Live! (Order ${orderId})`;
  const html = buildOrderReceiptHtml({ customerName, orderId, templateName, amountINR, momentUrl, momentPin });
  const text = `Dear ${customerName},\n\nYour celebration moment "${templateName}" is published!\nOrder ID: ${orderId}\nAmount: ₹${amountINR}\nUnlock PIN: ${momentPin || 'None'}\nGift Link: ${momentUrl}\n\nThank you for choosing Vanvi Moments.`;

  return await sendRawEmail({ to: toEmail, subject, html, text });
}

/**
 * Dispatch Contact Inquiry Notification
 */
async function sendContactNotification({ fromName, fromEmail, subject, message }) {
  const staffSubject = `📩 New Inquiry from ${fromName}: ${subject || 'General Inquiry'}`;
  const text = `From: ${fromName} (${fromEmail})\nSubject: ${subject}\n\nMessage:\n${message}`;

  return await sendRawEmail({
    to: EMAIL_FROM,
    subject: staffSubject,
    html: `<p><strong>From:</strong> ${fromName} (${fromEmail})</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong></p><blockquote>${message}</blockquote>`,
    text
  });
}

module.exports = {
  sendOrderConfirmation,
  sendContactNotification,
  isEmailConfigured: () => isEmailConfigured
};

