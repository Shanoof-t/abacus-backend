import nodemailer from "nodemailer";
import env from "./env_variables";
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.MAIL_EMAIL,
    pass: env.MAIL_PASS,
  },
});

export const mailOption = ({ email, otp }: { email: string; otp: string }) => {
  return {
    from: env.MAIL_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Enter <strong>${otp}</strong> in the app to verify</p><p>This OTP expires in 1 minute.</p>`,
  };
};
