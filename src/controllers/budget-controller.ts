import { CustomeRequest } from "../middlewares/jwt-authentication-middleware";
import {
  createBudget,
  fetchAllBudgets,
  fetchBudgetByCategoryName,
} from "../services/budget-service";
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
    console.log("getAllBudgets triggered");
    const budgets = await fetchAllBudgets(user);
    res.status(200).json({
      status: "success",
      message: "Successfully fetched budgets",
      data: budgets,
    });
  }
);

export const getBudget = asyncErrorHandler(async (req: CustomeRequest, res) => {
  const { user } = req;
  const { name } = req.params;
  const budget = await fetchBudgetByCategoryName({ user, name });
  res
    .status(200)
    .json({ status: "success", message: "successfully fetched", data: budget });
});
