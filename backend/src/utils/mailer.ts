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

const subjects={
    EMAIL_VALIDATION:"Verify your email for Finance Tracker",
    FORGOT_PASSWORD:"OTP for resetting your password for Finance Tracker"
}

const heading={
    EMAIL_VALIDATION:"Email verification",
    FORGOT_PASSWORD:"Reset your password"
}

export async function sendOtp(to: string, otp: string, expiresIn: number, type: "EMAIL_VALIDATION" | "FORGOT_PASSWORD" = "EMAIL_VALIDATION") {

  try {
  await transporter.sendMail({
    from: `"Finance Tracker" <${process.env.SMTP_USER}>`,
    to,
    subject: subjects[type],
    html: `
        <h2>${heading[type]}</h2>
        <p> Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in <b>${expiresIn} minutes</b>.</p>
      <p>If you didn’t request this, ignore this email.</p>
        `,
  });}
  catch(err){
    throw err;
  }
}
