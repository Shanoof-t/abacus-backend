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
import env from "../config/env_variables";

export const signUp = asyncErrorHandler(async (req: Request, res: Response) => {
  const { body } = req;
  const { email, id, user_name } = await createUser(body);

  const otpInfo = await createOTP({
    email,
    id,
    user_name,
  });

  res.status(200).json({
    status: "pending",
    message: "Verification otp email send",
    data: {
      userId: id,
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
    user: { id, email, user_name },
  } = await authenticateUser(body);

  if (process.env.NODE_ENV === "development") {
    res.cookie("token", accessToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
  } else {
    res.cookie("token", accessToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".abacuss.online",
      path: "/",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Successfully logged In.",
    data: { id, email, user_name },
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
  res.redirect(authorizationUrl);
});

export const googleOAuthcallback = asyncErrorHandler(async (req, res) => {
  const { code } = req.query;

  const data = await googleOAuthCallback(code as string);

  if (process.env.NODE_ENV === "development") {
    res.cookie("token", data.accessToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
  } else {
    res.cookie("token", data.accessToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".abacuss.online",
      path: "/",
    });
  }

  const redirectUrl = `${env.FRONT_END_URL}?name=${data.userData.user_name}`;
  res.redirect(redirectUrl);
});

export const logoutUser = asyncErrorHandler(async (req, res) => {
  if (process.env.NODE_ENV === "development") {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
  } else {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".abacuss.online",
      path: "/",
    });
  }

  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully" });
});
