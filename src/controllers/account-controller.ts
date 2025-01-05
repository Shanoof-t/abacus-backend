import { CustomeRequest } from "../middlewares/jwt-authentication-middleware";
import {
  createAccount,
  deleteAccounts,
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
  const data = await deleteAccounts(body);
  res
    .status(200)
    .json({ status: "success", message: "sanam kittieekkn", data });
});
