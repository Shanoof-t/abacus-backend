import { Types } from "mongoose";
import { createTransaction } from "../services/transaction-service";
import { asyncErrorHandler } from "../utils/error-handlers";

// type Decoded = { sub?: Types.ObjectId; email?: string };
// interface CustomRequest extends Request {
//     user?: Decoded;
//   }

export const addTransaction = asyncErrorHandler(async (req, res) => {
  const { body } = req;
//   console.log(req.user)
  const transaction = await createTransaction(body);
  res
    .status(200)
    .json({
      status: "success",
      message: "Transaction is successfull.",
      data: transaction,
    });
});
