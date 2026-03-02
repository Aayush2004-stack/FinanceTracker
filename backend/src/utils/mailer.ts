import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtp(to: string, otp: string, expiresIn: number) {
  await transporter.sendMail({
    from: `"Finance Tracker" <${process.env.SMTP_USER}>`,
    to,
    subject: "Verify the email for Finance Tracker",
    html: `
        <h2>Email verification</h2>
        <p> Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in <b>${expiresIn} minutes</b>.</p>
      <p>If you didn’t request this, ignore this email.</p>
        `,
  });
}
