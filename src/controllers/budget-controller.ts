import { CustomeRequest } from "../middlewares/jwt-authentication-middleware";
import {
  createBudget,
  deleteBudgetByName,
  fetchAllBudgets,
  fetchBudgetByCategoryName,
  updateBudgetByName,
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
  const { id } = req.params;

  const budget = await fetchBudgetByCategoryName({ user, id });

  res
    .status(200)
    .json({ status: "success", message: "successfully fetched", data: budget });
});

export const deleteBudget = asyncErrorHandler(
  async (req: CustomeRequest, res) => {
    const { user } = req;
    const { id } = req.params;
    await deleteBudgetByName({ user, id });
    res
      .status(200)
      .json({ status: "success", message: "Successfully deleted budget" });
  }
);

export const updateBudget = asyncErrorHandler(
  async (req: CustomeRequest, res) => {
    const { user, body } = req;
    const { id } = req.params;
    console.log("body in controller", body);
    const existingBudget = await updateBudgetByName({ body, user, id });
    res
      .status(200)
      .json({
        status: "success",
        message: "Budget updated successfully",
        data: existingBudget,
      });
  }
);
