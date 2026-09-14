const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/* ── Password reset ─────────────────────────────────────────────────── */
const sendPasswordResetEmail = async (toEmail, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await transporter.sendMail({
    from: `"SmartCart" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: 'Reset your SmartCart password',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px;">
        <div style="background:linear-gradient(135deg,#6C47FF,#7C3AED);padding:24px;border-radius:12px;text-align:center;margin-bottom:28px;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;letter-spacing:-0.02em;">SmartCart</h1>
        </div>
        <h2 style="color:#0F0E17;font-size:20px;margin:0 0 12px;">Reset your password</h2>
        <p style="color:#6B6B80;line-height:1.7;margin:0 0 24px;">
          We received a request to reset your password. Click the button below — this link expires in <strong>1 hour</strong>.
        </p>
        <a href="${resetUrl}" style="display:inline-block;background:#6C47FF;color:#fff;padding:14px 32px;border-radius:999px;text-decoration:none;font-weight:700;font-size:15px;margin-bottom:24px;">
          Reset Password
        </a>
        <p style="color:#9999AA;font-size:13px;margin:0;">
          If you didn't request this, you can safely ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #E4E6EF;margin:24px 0;" />
        <p style="color:#9999AA;font-size:12px;margin:0;">
          Or copy this link: <a href="${resetUrl}" style="color:#6C47FF;">${resetUrl}</a>
        </p>
      </div>
    `,
  });
};

/* ── Order confirmation ─────────────────────────────────────────────── */
const sendOrderConfirmationEmail = async (toEmail, userName, order) => {
  const itemRows = (order.items || []).map(item => `
    <tr>
      <td style="padding:12px 8px;border-bottom:1px solid #F1F5F9;font-size:14px;color:#2D2B3D;">
        ${item.productId?.name || 'Product'}
      </td>
      <td style="padding:12px 8px;border-bottom:1px solid #F1F5F9;font-size:14px;color:#6B6B80;text-align:center;">
        ${item.quantity}
      </td>
      <td style="padding:12px 8px;border-bottom:1px solid #F1F5F9;font-size:14px;color:#2D2B3D;text-align:right;font-weight:700;">
        $${(item.priceAtPurchase * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  const addr = order.shippingAddress;
  const addrStr = addr?.line1
    ? `${addr.fullName || ''}, ${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`
    : 'Not provided';

  await transporter.sendMail({
    from: `"SmartCart" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `Order Confirmed — #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:580px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px;">
        <div style="background:linear-gradient(135deg,#6C47FF,#7C3AED);padding:24px;border-radius:12px;text-align:center;margin-bottom:28px;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">SmartCart</h1>
          <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:14px;">Order Confirmation</p>
        </div>

        <h2 style="color:#0F0E17;font-size:20px;margin:0 0 8px;">Thanks, ${userName}! 🎉</h2>
        <p style="color:#6B6B80;line-height:1.7;margin:0 0 24px;">
          Your order <strong style="color:#6C47FF;">#${order._id.toString().slice(-8).toUpperCase()}</strong> has been confirmed and is being processed.
        </p>

        <div style="background:#fff;border:1px solid #E4E6EF;border-radius:12px;overflow:hidden;margin-bottom:20px;">
          <div style="padding:14px 16px;background:#F8F9FF;border-bottom:1px solid #E4E6EF;">
            <span style="font-size:13px;font-weight:700;color:#6C47FF;text-transform:uppercase;letter-spacing:0.05em;">Order Items</span>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr>
                <th style="padding:10px 8px;text-align:left;font-size:12px;color:#9999AA;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #E4E6EF;">Product</th>
                <th style="padding:10px 8px;text-align:center;font-size:12px;color:#9999AA;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #E4E6EF;">Qty</th>
                <th style="padding:10px 8px;text-align:right;font-size:12px;color:#9999AA;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #E4E6EF;">Total</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>
          <div style="padding:14px 16px;background:#F8F9FF;border-top:1px solid #E4E6EF;display:flex;justify-content:space-between;">
            <span style="font-weight:700;color:#0F0E17;font-size:15px;">Order Total</span>
            <span style="font-weight:800;color:#6C47FF;font-size:17px;">$${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div style="background:#fff;border:1px solid #E4E6EF;border-radius:12px;padding:16px;margin-bottom:24px;">
          <p style="font-size:13px;font-weight:700;color:#9999AA;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 6px;">Shipping To</p>
          <p style="color:#2D2B3D;font-size:14px;margin:0;line-height:1.6;">${addrStr}</p>
        </div>

        <p style="color:#9999AA;font-size:13px;text-align:center;margin:0;">
          Questions? Reply to this email or visit our <a href="${process.env.FRONTEND_URL}/contact" style="color:#6C47FF;">support page</a>.
        </p>
      </div>
    `,
  });
};

module.exports = { sendPasswordResetEmail, sendOrderConfirmationEmail };
