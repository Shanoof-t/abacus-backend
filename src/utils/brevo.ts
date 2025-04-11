// @ts-ignore
import SibApiV3Sdk from "sib-api-v3-sdk";
import env from "../config/env_variables";

async function sendOTPMail({
  otp,
  toEmail,
  userName,
}: {
  otp: string;
  toEmail: string;
  userName?: string;
}) {
  var defaultClient = SibApiV3Sdk.ApiClient.instance;
  var apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = env.BREVO_PASS;

  var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = {
    to: [{ email: toEmail }],
    sender: { name: "Abacus", email: env.BREVO_USER },
    subject: "Verify Your Email Address to Access Your Account",
    htmlContent: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 6px; padding: 30px; background-color: #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
  <h2 style="color: #333333; text-align: center; font-weight: 600; margin-top: 0;">Email Verification Required</h2>
  <p style="color: #555555; line-height: 1.6; font-size: 15px;">
    Hello ${userName},
  </p>
  <p style="color: #555555; line-height: 1.6; font-size: 15px;">
    Thank you for creating an account with Abacus. To ensure the security of your account and complete the registration process, please verify your email address by entering the verification code below:
  </p>
  <div style="text-align: center; margin: 30px 0;">
    <div style="font-size: 26px; font-weight: bold; color: #000000; padding: 15px;  display: inline-block; letter-spacing: 3px;">${otp}</div>
  </div>
  <p style="color: #555555; line-height: 1.6; font-size: 15px;">
    <strong>Important:</strong> This verification code expires in 1 minute for security purposes. If the code expires, you can request a new one within the application.
  </p>
  <p style="color: #555555; line-height: 1.6; font-size: 15px;">
    If you did not attempt to create an account with us, please disregard this email.
  </p>
  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;" />
  <p style="color: #777777; font-size: 14px; text-align: center; margin-bottom: 5px;">
    Regards,
  </p>
  <p style="color: #777777; font-size: 14px; text-align: center; margin-top: 0;">
    The Abacus Team
  </p>
  <div style="text-align: center; margin-top: 20px;">
    <a href="https://abacuss.online/privacy-policy" style="color: #777777; font-size: 12px; margin: 0 10px; text-decoration: none;">Terms of Service</a>
    <a href="https://abacuss.online/terms-of-service" style="color: #777777; font-size: 12px; margin: 0 10px; text-decoration: none;">Privacy Policy</a>
  </div>
  <p style="color: #999999; font-size: 12px; text-align: center; margin-top: 20px;">
    © 2025 Abacus. All rights reserved.
  </p>
</div>
    `,
  };

  const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
  console.log("response", response);
}

export default sendOTPMail;
