import { Request, Response } from "express";
import { authenticateUser, createUser } from "../services/auth-service";
import { asyncErrorHandler } from "../utils/error-handlers";

export const signUp = asyncErrorHandler(async (req: Request, res: Response) => {
  const { body } = req;
  const user = await createUser(body);
  res
    .status(201)
    .json({ status: "success", message: "Sign Up is Successfull", data: user });
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
