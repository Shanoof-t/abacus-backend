import { NextFunction, Request, Response } from "express";
import env from "../config/env_variables";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import CustomError from "../utils/Custom-error";

const { ACCESS_TOKEN_SECRET } = env;

export interface User {
  sub?: Types.ObjectId;
  email?: string;
}

export interface CustomeRequest extends Request {
  user?: User | undefined;
}

async function authenticateToken(
  req: CustomeRequest,
  res: Response,
  next: NextFunction
): Promise<any> {
  const token = req.cookies.token;

  if (!token) {
    const error = new CustomError("Access Denied", 400);
    next(error);
  }
  try {
    const user = (await jwt.verify(token, ACCESS_TOKEN_SECRET)) as User;
    if (!user) {
      const error = new CustomError("Access Denied", 400);
      next(error);
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export default authenticateToken;
