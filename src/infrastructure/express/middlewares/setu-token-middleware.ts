import { Request, Response, NextFunction } from "express";
import { fetchSetuToken } from "../../../shared/utils/setu"; 
import CustomError from "../../../shared/utils/Custom-error"; 

declare global {
  namespace Express {
    interface Request {
      setuToken?: string;
    }
  }
}

async function authenticateSetuToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = await fetchSetuToken();

    if (!token) {
      const error = new CustomError("Setu token is missing,Access Denied", 400);
      next(error);
    }

    req.setuToken = token;
    next();
  } catch (error) {
    console.log("Error in authenticateSetuToken", error);
    next(error);
  }
}

export default authenticateSetuToken