import { Request, Response } from "express";
import {
  authenticateUser,
  createOTP,
  createUser,
  userOTPReSend,
  verifyUserOTP,
} from "../services/auth-service";
import { asyncErrorHandler } from "../utils/error-handlers";

import { google } from "googleapis";
import env from "../config/env_variables";
import crypto from "crypto";
import axios from "axios";
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

export const googleAuth = asyncErrorHandler(async (req, res) => {
  const scopes = ["https://www.googleapis.com/auth/userinfo.profile", "openid"];

  const oauth2Client = new google.auth.OAuth2({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: "http://localhost:3000",
  });

  // const state = crypto.randomBytes(32).toString("hex");

  // req.session.state = state;

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
    // state: state,
  });

  console.log(authorizationUrl);
  
  res.status(200).json({
    status: "success",
    message: "google auth request is successfull",
    data: { redirectUrl: authorizationUrl },
  });
  // res.redirect(authorizationUrl)
});

const getUserData = async (access_token: unknown) => {
  try {
    console.log("in get user", access_token);
    const data = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token${access_token}`
    );
    console.log("data in the get user", data);
  } catch (error) {
    console.log("error in the get user", error);
  }
};

export const googleOAuth = asyncErrorHandler(async (req, res) => {
  const { code } = req.body;
  console.log(code);
  const oauth2Client = new google.auth.OAuth2({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: "http://localhost:3000",
  });
  const response = await oauth2Client.getToken(code);
  const tokens = await oauth2Client.setCredentials(response.tokens);

  console.log("token kittum", tokens);

  const user = oauth2Client.credentials;

  console.log("user credentials", user);

  await getUserData(user.access_token);

  res.status(200).json({ message: "ok" });
});
