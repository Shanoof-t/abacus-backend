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

export const addTransaction = asyncErrorHandler(async (req, res) => {
  const { body, user } = req;

  const { alert, transaction } = await createTransaction(body, user);

  res.status(200).json({
    status: "success",
    message: "Transaction is successful.",
    data: transaction,
    alert,
  });
});

export const getAllTransactions = asyncErrorHandler(async (req, res) => {
  const { user } = req;
  const transactions = await fetchAllTransactions(user);
  res
    .status(200)
    .json({ status: "success", message: "Success", data: transactions });
});

export const deleteBulkTransactions = asyncErrorHandler(async (req, res) => {
  const { body } = req;
  console.log("body:", body);
  const data = await deleteTransactions(body);
  res.status(200).json({
    status: "success",
    message: "Transactions deletion successfull.",
    data,
  });
});

export const deleteTransaction = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const data = await deleteTransactionById(id);
  res.status(200).json({
    status: "success",
    message: "Transaction deleted successfully.",
    data,
  });
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

export const editTransaction = asyncErrorHandler(async (req, res) => {
  const { body, user } = req;
  const { id } = req.params;
  const transaction = await editTransactionById(body, id, user);
  res.status(200).json({
    status: "success",
    message: "Transaction updated.",
    data: transaction,
  });
});

export const createBulkTransactions = asyncErrorHandler(async (req, res) => {
  const { user, body } = req;
  const data = await createTransactions({ body, user });
  res.status(200).json({
    status: "success",
    message: "transactions created successfully",
    data,
  });
});
