// @ts-ignore
import SibApiV3Sdk from "sib-api-v3-sdk";
import env from "../config/env_variables";

async function sendOTPMail({ otp, toEmail }: { otp: string; toEmail: string }) {
  var defaultClient = SibApiV3Sdk.ApiClient.instance;
  var apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = env.BREVO_PASS;

  var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = {
    to: [{ email: toEmail }],
    sender: { name: "Abacus", email: env.BREVO_USER },
    subject: "Verify Your Email Address to Access Your Account",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
        <p style="color: #555; line-height: 1.6; text-align: center;">
          Hi there,
        </p>
        <p style="color: #555; line-height: 1.6;">
          Thank you for signing up with us! To complete your registration, please verify your email address by entering the following OTP in the app:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #4caf50; padding: 10px 20px; border: 1px dashed #4caf50; border-radius: 8px; display: inline-block;">${otp}</span>
        </div>
        <p style="color: #555; line-height: 1.6;">
          <strong>Note:</strong> This OTP is valid for 1 minute. If it expires, you can request a new one from the app.
        </p>
        <p style="color: #555; line-height: 1.6;">
          If you did not initiate this request, please ignore this email.
        </p>
        <p style="color: #555; line-height: 1.6;">Best regards,<br />The Abacus Team</p>
      </div>
    `,
  };

  const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
  console.log("response", response);
}

export default sendOTPMail;
