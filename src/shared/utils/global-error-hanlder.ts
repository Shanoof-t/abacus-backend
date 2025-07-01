import { Request, Response, NextFunction } from "express";

type Error = {
  statusCode: number;
  status: string;
  message: string;
  stack: any;
  error: any;
  isOperational?: boolean;
};

const devErrors = (res: Response, error: Error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error,
  });
};

const prodErrors = (res: Response, error: Error) => {
  if (error.isOperational) {
    res
      .status(error.statusCode)
      .json({ status: error.status, message: error.message });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

export default (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    prodErrors(res, error);
  }
};
