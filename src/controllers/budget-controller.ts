import {
  createBudget,
  deleteBudgetByName,
  fetchAllBudgets,
  fetchBudgetByCategoryName,
  fetchBudgetById,
  updateBudgetByName,
} from "../services/budget-service";
import { asyncErrorHandler } from "../utils/error-handlers";

export const addBudget = asyncErrorHandler(async (req, res) => {
  const { body, user } = req;
  const budget = await createBudget(body, user);
  res.status(200).json({
    status: "success",
    message: "Successfully created budget.",
    data: budget,
  });
});

export const getAllBudgets = asyncErrorHandler(async (req, res) => {
  const { user } = req;
  const budgets = await fetchAllBudgets(user);
  res.status(200).json({
    status: "success",
    message: "Successfully fetched budgets",
    data: budgets,
  });
});

export const getBudget = asyncErrorHandler(async (req, res) => {
  const { user } = req;
  const { id } = req.params;

  const budget = await fetchBudgetById({ user, id });

  res
    .status(200)
    .json({ status: "success", message: "successfully fetched", data: budget });
});

export const deleteBudget = asyncErrorHandler(async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  await deleteBudgetByName({ user, id });
  res
    .status(200)
    .json({ status: "success", message: "Successfully deleted budget" });
});

export const updateBudget = asyncErrorHandler(async (req, res) => {
  const { user, body } = req;
  const { id } = req.params;
  console.log("body in controller", body);
  const existingBudget = await updateBudgetByName({ body, user, id });
  res.status(200).json({
    status: "success",
    message: "Budget updated successfully",
    data: existingBudget,
  });
});

export const getBudgetByCategory = asyncErrorHandler(async (req, res) => {
  const { user } = req;
  const { category } = req.params;
  const budget = await fetchBudgetByCategoryName({ user, category });
  res.status(200).json({
    status: "success",
    message: "Successfully fethched budget",
    data: budget,
  });
});
