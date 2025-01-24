import { Response } from "express";
import {
  createTransaction,
  createTransactions,
  deleteTransactionById,
  deleteTransactions,
  editTransactionById,
  fetchAllTransactions,
  fetchTransactionById,
} from "../services/transaction-service";
import { asyncErrorHandler } from "../utils/error-handlers";
import { CustomeRequest } from "../middlewares/jwt-authentication-middleware";

export const addTransaction = asyncErrorHandler(
  async (req: CustomeRequest, res: Response) => {
    const { body, user } = req;

    const { alert, transaction } = await createTransaction(body, user);

    res.status(200).json({
      status: "success",
      message: "Transaction is successful.",
      data: transaction,
      alert,
    });
  }
);

export const getAllTransactions = asyncErrorHandler(
  async (req: CustomeRequest, res: Response) => {
    const { user } = req;
    const transactions = await fetchAllTransactions(user);
    res
      .status(200)
      .json({ status: "success", message: "Success", data: transactions });
  }
);

export const deleteBulkTransactions = asyncErrorHandler(async (req, res) => {
  const { body } = req;
  await deleteTransactions(body);
  res
    .status(200)
    .json({ status: "success", message: "Transactions deletion successfull." });
});

export const deleteTransaction = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  await deleteTransactionById(id);
  res
    .status(200)
    .json({ status: "success", message: "Transaction deleted successfully." });
});

export const getTransaction = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const transaction = await fetchTransactionById(id);
  res.status(200).json({
    status: "success",
    message: "Successfully fetched transaction",
    data: transaction,
  });
});

export const editTransaction = asyncErrorHandler(
  async (req: CustomeRequest, res: Response) => {
    const { body, user } = req;
    const { id } = req.params;
    await editTransactionById(body, user, id);
    res
      .status(200)
      .json({ status: "success", message: "Transaction updated." });
  }
);

export const createBulkTransactions = asyncErrorHandler(
  async (req: CustomeRequest, res) => {
    const { user, body } = req;
    await createTransactions({ body, user });
    res
      .status(200)
      .json({
        status: "success",
        message: "transactions created successfully",
      });
  }
);
