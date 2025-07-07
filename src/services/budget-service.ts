import { z } from "zod";
import schema from "../schema/budget-schema";
import { User as UserType } from "../middlewares/jwt-authentication-middleware";
import { Budget } from "../models/budget-model";
import { Transaction } from "../models/transaction-model";
import CustomError from "../utils/Custom-error";
import budgetHelper from "../helpers/budget-helper";

type CreateBudget = z.infer<typeof schema.add>;
type User = UserType | undefined;

export const createBudget = async (body: CreateBudget, user: User) => {
  const exisingBudget = await budgetHelper.findOneBudgetWithCategory({
    user_id: user?.sub,
    category_name: body.category_name,
  });

  if (exisingBudget)
    throw new CustomError(
      "This category with a budget is already existing",
      400
    );

  const budgetLimit = body.amount_limit;

  const transactions = await Transaction.find({
    user_id: user?.sub,
    category_name: body.category_name,
    transaction_type: "expense",
  });

  const totalSpentAmount = transactions.reduce(
    (acc, value) => acc + value.transaction_amount,
    0
  );

  const total_spent = Math.abs(totalSpentAmount);

  const progress = Math.max((total_spent / Number(budgetLimit)) * 100, 100)

  const budget = await Budget.create({
    user_id: user?.sub,
    budget_name: body.budget_name,
    budget_start_date: new Date(body.budget_start_date),
    budget_end_date: new Date(body.budget_end_date),
    category_name: body.category_name,
    amount_limit: Number(body.amount_limit),
    budget_note: body.budget_note,
    notification_status: body.notification_status,
    alert_threshold: body.alert_threshold,
    total_spent,
    progress: Math.round(Math.min(Math.max(progress, 100), 0)),
  });
  return budget;
};

export const fetchAllBudgets = async (user: User) => {
  const budgets = await Budget.find({ user_id: user?.sub });
  return budgets;
};

type BudgetByCategoryName = {
  user: User;
  id: string;
};
export const fetchBudgetById = async ({ user, id }: BudgetByCategoryName) => {
  const budget = await Budget.findOne({
    _id: id,
  });
  if (!budget) throw new CustomError("Can't find budget with this id", 400);
  return budget;
};

export const deleteBudgetByName = async ({
  user,
  id,
}: BudgetByCategoryName) => {
  await Budget.deleteOne({ _id: id });
};

export const updateBudgetByName = async ({
  body,
  user,
  id,
}: {
  body: CreateBudget;
  user: User;
  id: string;
}) => {
  const currentBudget = await Budget.findById(id);

  if (currentBudget?.category_name !== body.category_name) {
    const exisingBudget = await budgetHelper.findOneBudgetWithCategory({
      user_id: user?.sub,
      category_name: body.category_name,
    });

    if (exisingBudget)
      throw new CustomError(
        "This category with a budget is already existing",
        400
      );
  }

  const budgetLimit = body.amount_limit;

  const transactions = await Transaction.find({
    user_id: user?.sub,
    category_name: body.category_name,
    transaction_type: "expense",
  });

  const totalSpentAmount = transactions.reduce(
    (acc, value) => acc + value.transaction_amount,
    0
  );

  const total_spent = Math.abs(totalSpentAmount);

  const progress = Math.min((total_spent / Number(budgetLimit)) * 100, 100);

  const updatedData = {
    budget_name: body.budget_name,
    category_name: body.category_name,
    amount_limit: Number(body.amount_limit),
    budget_start_date: new Date(body.budget_start_date),
    budget_end_date: new Date(body.budget_end_date),
    budget_note: body.budget_note,
    total_spent,
    progress: Math.round(Math.max(progress, 100)),
  };

  await Budget.updateOne({ user_id: user?.sub, _id: id }, updatedData);

  return await Budget.findById(id);
};

export const fetchBudgetByCategoryName = async ({
  user,
  category,
}: {
  user: User;
  category: string;
}) => {
  const budget = await budgetHelper.findOneBudgetWithCategory({
    user_id: user?.sub,
    category_name: category,
  });
  return budget;
};
