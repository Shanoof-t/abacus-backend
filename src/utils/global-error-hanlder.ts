import { Request, Response, NextFunction } from "express";

export default (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(400).json(error);
};
