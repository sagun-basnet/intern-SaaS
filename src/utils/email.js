const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'Lunar SaaS'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (err) {
    console.error('Error sending email:', err);
    throw new Error('Failed to send email.');
  }
};

const sendOTP = async (email, otp) => {
  const subject = 'Your Verification Code - Lunar SaaS';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Verify Your Account</h2>
      <p>Hello,</p>
      <p>Thank you for registering with Lunar SaaS. Please use the following One-Time Password (OTP) to verify your account. This code is valid for 10 minutes.</p>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1e1b4b; border-radius: 5px; margin: 20px 0;">
        ${otp}
      </div>
      <p>If you did not request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2024 Lunar SaaS. All rights reserved.</p>
    </div>
  `;
  
  return sendEmail({
    to: email,
    subject,
    text: `Your verification code is ${otp}. It expires in 10 minutes.`,
    html,
  });
};

module.exports = { sendEmail, sendOTP };
