import { Request, Response } from "express";
import { createUser } from "../services/auth-service";
import { asyncErrorHandler } from "../utils/error-handlers";

export const signUp = asyncErrorHandler(async (req: Request, res: Response) => {
  const { body } = req;
  const user = await createUser(body);
  res
    .status(201)
    .json({ status: "success", message: "Sign Up is Successfull", data: user });
});
