import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import env from "../config/env_variables";

const { ACCESS_TOKEN_SECRET } = env;

type Decoded = { sub?: Types.ObjectId; email?: string };

interface CustomRequest extends Request {
  user?: Decoded;
}


const verifyToken = (token: string, secret: string): Promise<Decoded> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as Decoded);
      }
    });
  });
};

async function authenticateToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<any> {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ status: "error", message: "Access denied" });
  }

  try {
    const decoded = await verifyToken(token, ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return res
        .status(403)
        .json({ status: "error", message: "Access denied" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ status: "error", message: "Access denied" });
  }
}

export default authenticateToken;
