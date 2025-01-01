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
  const { email, _id } = await createUser(body);

  await createOTP({ email, _id });

  res.status(200).json({
    status: "pending",
    message: "Verification otp email send",
    data: {
      userId: _id,
      email: email,
    },
  });
});

export const signIn = asyncErrorHandler(async (req: Request, res: Response) => {
  const { body } = req;
  const {
    accessToken,
    user: { _id, email },
  } = await authenticateUser(body);

  res.cookie("token", accessToken, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  res.status(200).json({
    status: "success",
    message: "Successfully logged In.",
    data: { _id, email },
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
    path: "/",
  });

  res.status(200).json({
    status: "success",
    message: "google authentication is Successfull",
    data,
  });
});
