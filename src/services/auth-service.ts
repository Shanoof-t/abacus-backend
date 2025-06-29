import userHelper from "../helpers/user-helper";
import CustomError from "../utils/Custom-error";
import { CreateOTP, OtpBody, SignIn, SignUp } from "../types/auth-types";
import securityHelper from "../helpers/security-helper";
import tokenHelper from "../helpers/token-helper";
import authHelper from "../helpers/auth-helper";
import { OneTimePassword } from "../models/otp-verification-model";
import { User } from "../models/user-model";
import { googleOauth2Client } from "../config/google_oauth2";
import sendOTPMail from "../utils/brevo";
import { mailOption, transporter } from "../config/nodemailer";

export const createUser = async (user: SignUp) => {
  const { email } = user;

  const existingUser = await User.findOne({ email });

  if (existingUser && existingUser.isVerified === true) {
    throw new CustomError(`You already registered with this email`, 400);
  } else if (existingUser) {
    return existingUser;
  }

  return await userHelper.addUser(user);
};

export const authenticateUser = async (loginData: SignIn) => {
  const { email, password } = loginData;
  const user = await userHelper.getUser({ email });
  if (!user) throw new CustomError("Your email is incorrect", 404);

  if (!user.password && user.isGoogle) {
    throw new CustomError(
      "You are sign up with google,try google sign in.",
      500
    );
  } else if (!user.password) {
    throw new CustomError("Can't find the password,", 500);
  }

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

export const createOTP = async ({ _id, email, userName }: CreateOTP) => {
  const otp = authHelper.generateOTP();
  const hashedOTP = await securityHelper.hashOTP({ otp });
  const otpInfo = await authHelper.createOneTimePassword({
    _id,
    hashedOTP,
    email,
  });

  if (process.env.NODE_ENV === "development") {
    const option = mailOption({ email, otp });
    const result = await transporter.sendMail(option);
    console.log("✅ Email sent:", result.response);
  } else {
    await sendOTPMail({ otp, toEmail: email, userName });
  }

  return otpInfo;
};

export const verifyUserOTP = async (body: OtpBody) => {
  const { otp, userId } = body;
  const userOTPRecord = await OneTimePassword.findOne({ userId }).sort({
    expiresAt: -1,
  });
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

  return googleOauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });
};

export const googleOAuthCallback = async (code: string) => {
  const response = await googleOauth2Client.getToken(code);
  await googleOauth2Client.setCredentials(response.tokens);
  const user = googleOauth2Client.credentials;
  const { email, sub, picture, name } = await authHelper.getUserDataFromGoogle(
    user.access_token
  );
  const userfromdb = await userHelper.getUser({ email: email });

  if (
    userfromdb &&
    email === userfromdb.email &&
    userfromdb.isGoogle === false
  ) {
    throw new CustomError(
      `You already signup with this ${email},please signin.`,
      400
    );
  }

  let userData = userfromdb;

  if (!userfromdb) {
    const user = await User.create({
      user_name: name,
      email: email,
      googleId: sub,
      picture: picture,
      isGoogle: true,
      isVerified: true,
    });
    userData = user;
  }

  if (!userData)
    throw new CustomError(
      `Can't find user with this email ${email},please signup.`,
      404
    );

  const payload = { sub: userData._id, email: userData.email };
  const accessToken = tokenHelper.generateToken(payload);

  return { accessToken, userData };
};
