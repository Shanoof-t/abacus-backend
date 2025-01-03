import { Response } from "express";
import { createTransaction } from "../services/transaction-service";
import { asyncErrorHandler } from "../utils/error-handlers";
import { CustomeRequest } from "../middlewares/jwt-authentication-middleware";

export const addTransaction = asyncErrorHandler(
  async (req: CustomeRequest, res: Response) => {
    const { body, user } = req;

    const transaction = await createTransaction(body, user);
    res.status(200).json({
      status: "success",
      message: "Transaction is successful.",
      data: transaction,
    });
  }
);
