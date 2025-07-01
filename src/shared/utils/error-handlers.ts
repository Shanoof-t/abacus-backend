import { Request, Response, NextFunction } from "express";


export const asyncErrorHandler = function (
  func: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return function (req: Request, res: Response, next: NextFunction) {
    func(req, res, next).catch((err) => next(err));
  };
};
