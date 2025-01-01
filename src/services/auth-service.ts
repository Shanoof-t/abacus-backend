import userHelper from "../helpers/user-helper";
import CustomError from "../utils/Custom-error";
import { CreateOTP, OtpBody, SignIn, SignUp } from "../types/auth-types";
import securityHelper from "../helpers/security-helper";
import tokenHelper from "../helpers/token-helper";
import authHelper from "../helpers/auth-helper";
import { mailOption, transporter } from "../config/nodemailer";
import { OneTimePassword } from "../models/otp-verification-model";
import { User } from "../models/user-model";

import { OAuth2Client } from "google-auth-library";
import env from "../config/env_variables";
import { google } from "googleapis";

export const createUser = async (user: SignUp) => {
  const { email } = user;
  const existingUser = await userHelper.getUser({ email });
  if (existingUser)
    throw new CustomError(`You already registered with this email`, 400);
  return await userHelper.addUser(user);
};

export const authenticateUser = async (loginData: SignIn) => {
  const { email, password } = loginData;
  const user = await userHelper.getUser({ email });
  if (!user) throw new CustomError("Your email is incorrect", 404);
  const isPasswordCorrect = await securityHelper.VerifyPassword({
    password,
    existingPassword: user.password,
  });
  if (!isPasswordCorrect)
    throw new CustomError("Check your password again", 401);
  const payload = { sub: user._id, email: user.email };
  const accessToken = tokenHelper.generateToken(payload);
  return { accessToken, user };
};

export const createOTP = async ({ _id, email }: CreateOTP) => {
  const otp = authHelper.generateOTP();
  const hashedOTP = await securityHelper.hashOTP({ otp });
  await authHelper.createOneTimePassword({ _id, hashedOTP, email });
  const mailOptions = mailOption({ email, otp });
  return await transporter.sendMail(mailOptions);
};

export const verifyUserOTP = async (body: OtpBody) => {
  const { otp, userId } = body;
  const userOTPRecord = await OneTimePassword.findOne({ userId });
  if (!userOTPRecord) {
    throw new CustomError(
      "Account record doesn't exist or has been verified already.Please sign up or sign in.",
      400
    );
  } else {
    const { expiresAt, otp: hashedOTP } = userOTPRecord;
    if (!expiresAt) {
      throw new CustomError("expiresAt is not defined", 500);
    }
    if (expiresAt.getTime() < Date.now()) {
      await OneTimePassword.deleteOne({ userId });
      throw new CustomError("OTP has expired.Please try again.", 400);
    } else {
      if (!hashedOTP) {
        throw new CustomError("Invalid OTP record. Please try again.", 500);
      }
      const validOTP = await securityHelper.verifyOTP({ otp, hashedOTP });
      if (!validOTP) {
        throw new CustomError("Invalid OTP.Please check again.", 400);
      } else {
        await User.updateOne({ _id: userId }, { isVerified: true });
        await OneTimePassword.deleteOne({ userId });
      }
    }
  }
};

export const userOTPReSend = async (body: { userId: string }) => {
  const { userId } = body;
  const user = await userHelper.getUser({ _id: userId });
  if (!user) throw new CustomError("user not founded", 404);
  const { email, _id } = user;
  await createOTP({ email, _id });
};

export const googleOAuthRequest = async () => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "openid",
  ];
  const oauth2Client = new google.auth.OAuth2({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: env.GOOGLE_REDIRECT_URL,
  });

  // const state = crypto.randomBytes(32).toString("hex");

  // req.session.state = state;

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
    // include_granted_scopes: true,
    // state: state,
  });
};

export const googleOAuthCallback = async (code:string) => {
  const oauth2Client = new google.auth.OAuth2({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: env.GOOGLE_REDIRECT_URL,
  });
  const response = await oauth2Client.getToken(code);
  await oauth2Client.setCredentials(response.tokens);
  const user = oauth2Client.credentials;
  const userInfo =  await authHelper.getUserDataFromGoogle(user.access_token);
  
  return userInfo
};
