import { CustomeRequest } from "../middlewares/jwt-authentication-middleware";
import {
  createAccount,
  deleteAccountById,
  deleteAccounts,
  editAccountById,
  fetchAccountById,
  fetchAllAccountsByUserId,
} from "../services/account-service";
import { asyncErrorHandler } from "../utils/error-handlers";

export const addAccount = asyncErrorHandler(
  async (req: CustomeRequest, res) => {
    const { body, user } = req;
    await createAccount(body, user);
    res
      .status(201)
      .json({ status: "success", message: "Account created successfully" });
  }
);

export const getAllAccounts = asyncErrorHandler(
  async (req: CustomeRequest, res) => {
    const { user } = req;
    const accounts = await fetchAllAccountsByUserId(user);
    res
      .status(200)
      .json({ status: "success", message: "Success", data: accounts });
  }
);

export const accountBulkDelete = asyncErrorHandler(async (req, res) => {
  const { body } = req;
  await deleteAccounts(body);
  res
    .status(200)
    .json({ status: "success", message: "Accounts delete successfull." });
});

export const deleteAccount = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  await deleteAccountById(id);
  res
    .status(200)
    .json({ status: "success", message: "Account deleted successfully." });
});

export const editAccount = asyncErrorHandler(
  async (req: CustomeRequest, res) => {
    const { body } = req;
    const { id } = req.params;
    const { user } = req;
    await editAccountById({ body, id, user });
    res
      .status(200)
      .json({ status: "success", message: "Account successfully edited." });
  }
);

export const getAccount = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const data = await fetchAccountById(id);
  res 
    .status(200)
    .json({ status: "success", message: "Account fetch successfull.", data });
});
