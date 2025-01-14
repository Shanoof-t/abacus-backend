import { CustomeRequest } from "../middlewares/jwt-authentication-middleware";
import { createBudget, fetchAllBudgets } from "../services/budget-service";
import { asyncErrorHandler } from "../utils/error-handlers";

export const addBudget = asyncErrorHandler(async (req: CustomeRequest, res) => {
  const { body, user } = req;
  await createBudget(body, user);
  res
    .status(200)
    .json({ status: "success", message: "Successfully created budget." });
});

export const getAllBudgets = asyncErrorHandler(
  async (req: CustomeRequest, res) => {
    const { user } = req;
    const budgets = await fetchAllBudgets(user);
    res.status(200).json({
      status: "success",
      message: "Successfully fetched budgets",
      data: budgets,
    });
  }
);
