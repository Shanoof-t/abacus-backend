import { Request, Response } from "express";
import {
  authenticateUser,
  createOTP,
  createUser,
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
  
});
