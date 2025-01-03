import { createAccount } from "../services/account-service";
import { asyncErrorHandler } from "../utils/error-handlers";

export const addAccount = asyncErrorHandler(async (req, res) => {
  const { body } = req;
  await createAccount(body);
});
