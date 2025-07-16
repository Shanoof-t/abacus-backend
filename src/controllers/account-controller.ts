import {
  createAccount,
  deleteAccountById,
  deleteAccounts,
  editAccountById,
  fetchAccountById,
  fetchAllAccountsByUserId,
} from "../services/account-service";
import { asyncErrorHandler } from "../utils/error-handlers";

export const addAccount = asyncErrorHandler(async (req, res) => {
  const { body, user } = req;
  const account = await createAccount(body, user);
  res.status(201).json({
    status: "success",
    message: "Account created successfully",
    data: account,
  });
});

export const getAllAccounts = asyncErrorHandler(async (req, res) => {
  const { user } = req;
  const accounts = await fetchAllAccountsByUserId(user);
  res
    .status(200)
    .json({ status: "success", message: "Success", data: accounts });
});

export const accountBulkDelete = asyncErrorHandler(async (req, res) => {
  const { body } = req;
  const accounts = await deleteAccounts(body);
  res
    .status(200)
    .json({
      status: "success",
      message: "Accounts delete successfull.",
      data: accounts,
    });
});

export const deleteAccount = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const account = await deleteAccountById(id);
  res.status(200).json({
    status: "success",
    message: "Account deleted successfully.",
    data: account,
  });
});

export const editAccount = asyncErrorHandler(async (req, res) => {
  const { body } = req;
  const { id } = req.params;
  const { user } = req;
  const account = await editAccountById({ body, id, user });
  res.status(200).json({
    status: "success",
    message: "Account successfully edited.",
    data: account,
  });
});

export const getAccount = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const data = await fetchAccountById(id);
  res
    .status(200)
    .json({ status: "success", message: "Account fetch successfull.", data });
});
