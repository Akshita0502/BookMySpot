const nodemailer= require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendOtpEmail = async (email, otp, type) => {
    try{
        const mailOptions = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Your OTP for BookMySpot",
  text: `Your OTP for ${type} is: ${otp}. It will expire in 5 minutes.`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #4F46E5; text-align: center;">BookMySpot 🎟️</h2>
      <p style="color: #333; font-size: 16px;">Hi there,</p>
      <p style="color: #333; font-size: 16px;">Your OTP for <strong>${type}</strong> is:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4F46E5; background: #EEF2FF; padding: 15px 30px; border-radius: 8px;">
          ${otp}
        </span>
      </div>
      <p style="color: #666; font-size: 14px;">⏱ This OTP will expire in <strong>5 minutes</strong>.</p>
      <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #aaa; font-size: 12px; text-align: center;">© 2025 BookMySpot. All rights reserved.</p>
    </div>
  `
};
        
    

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email} for ${type}`);
    } catch (error) {
        console.error(`Error sending OTP email to ${email} for ${type}:`, error);
    }
};



