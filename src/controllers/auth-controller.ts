import { Request, Response } from "express";
import {
  authenticateUser,
  createOTP,
  createUser,
  googleOAuthCallback,
  googleOAuthRequest,
  userOTPReSend,
  verifyUserOTP,
} from "../services/auth-service";
import { asyncErrorHandler } from "../utils/error-handlers";

export const signUp = asyncErrorHandler(async (req: Request, res: Response) => {
  const { body } = req;
  const { email, _id, user_name } = await createUser(body);

  const otpInfo = await createOTP({
    email,
    _id,
    userName: user_name as string,
  });

  res.status(200).json({
    status: "pending",
    message: "Verification otp email send",
    data: {
      userId: _id,
      email: email,
      userName: user_name,
      otpInfo,
    },
  });
});

export const signIn = asyncErrorHandler(async (req: Request, res: Response) => {
  const { body } = req;
  const {
    accessToken,
    user: { _id, email, user_name },
  } = await authenticateUser(body);

  res.cookie("token", accessToken, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });
  // res.cookie("token", accessToken, {
  //   maxAge: 24 * 60 * 60 * 1000,
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "none",
  //   domain: ".abacuss.online",
  //   path: "/",
  // });

  res.status(200).json({
    status: "success",
    message: "Successfully logged In.",
    data: { _id, email, user_name },
  });
});

export const verifyOTP = asyncErrorHandler(async (req, res) => {
  const { body } = req;
  await verifyUserOTP(body);
  res.status(200).json({
    status: "success",
    message: "OTP vefication is success",
  });
});

export const resendOTP = asyncErrorHandler(async (req, res) => {
  const { body } = req;
  await userOTPReSend(body);
  res.status(200).json({
    status: "success",
    message: "Retry otp is success",
  });
});

export const googleOAuth = asyncErrorHandler(async (req, res) => {
  const authorizationUrl = await googleOAuthRequest();

  res.status(200).json({
    status: "success",
    message: "google auth request is successfull",
    data: { redirectUrl: authorizationUrl },
  });
});

export const googleOAuthcallback = asyncErrorHandler(async (req, res) => {
  const { code } = req.body;
  const data = await googleOAuthCallback(code);

  res.cookie("token", data.accessToken, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: ".abacuss.online",
    path: "/",
  });

  res.status(200).json({
    status: "success",
    message: "google authentication is Successfull",
    data,
  });
});

export const logoutUser = asyncErrorHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: ".abacuss.online",
    path: "/",
  });
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully" });
});
