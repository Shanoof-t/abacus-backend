import { NextFunction, Request, Response } from "express";
import env from "../config/env_variables";
import jwt from "jsonwebtoken";
import CustomError from "../utils/Custom-error";

const { ACCESS_TOKEN_SECRET } = env;

async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    const error = new CustomError("Access Denied", 400);
    next(error);
  }
  try {
    const user = jwt.verify(token, ACCESS_TOKEN_SECRET) as {
      sub: string;
      email: string;
    };
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
