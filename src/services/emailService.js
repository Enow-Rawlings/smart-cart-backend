const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendPasswordResetEmail = async (toEmail, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await transporter.sendMail({
    from: `"SmartCart" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: 'Reset your SmartCart password',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #2563eb;">Reset your password</h2>
        <p>We received a request to reset your SmartCart password. Click the button below to choose a new one — this link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #64748b; font-size: 13px;">If you didn't request this, you can safely ignore this email — your password won't be changed.</p>
        <p style="color: #94a3b8; font-size: 12px;">Or copy this link: ${resetUrl}</p>
      </div>
    `,
  });
};

module.exports = { sendPasswordResetEmail };