import { Request, Response } from "express";
import { createTransaction } from "../services/transaction-service";
import { asyncErrorHandler } from "../utils/error-handlers";
import { CustomeUser } from "../middlewares/jwt-authentication-middleware";

// type Decoded = { sub?: Types.ObjectId; email?: string };

// interface CustomRequest extends Request {
//   user?: Decoded;
// }

export const addTransaction = asyncErrorHandler(async (req: CustomeUser, res: Response) => {
  const { body, user } = req;
  console.log(user);

  const transaction = await createTransaction(body, user);
  res.status(200).json({
    status: "success",
    message: "Transaction is successful.",
    data: transaction,
  });
});
