import { CustomeRequest } from "../middlewares/jwt-authentication-middleware";
import {
  createSummary,
  fetchFinancialHistory,
} from "../services/statistics-service";
import { asyncErrorHandler } from "../utils/error-handlers";

export const financialSummary = asyncErrorHandler(
  async (req: CustomeRequest, res) => {
    const { user, body } = req;
    const stati = await createSummary(user, body);
    res.status(200).json({
      status: "success",
      message: "Successfully fetched money statistics",
      data: stati,
    });
  }
);

export const serialFinincialSummary = asyncErrorHandler(
  async (req: CustomeRequest, res) => {
    const { user } = req;
    await fetchFinancialHistory(user);
    res
      .status(200)
      .json({ status: "success", message: "history fetch success" });
  }
);
