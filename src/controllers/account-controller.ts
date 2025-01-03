import { CustomeRequest } from "../middlewares/jwt-authentication-middleware";
import { createAccount } from "../services/account-service";
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
