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

  const progress = (total_spent / Number(budgetLimit)) * 100;

  await Budget.create({
    user_id: user?.sub,
    account_name: body.account_name,
    budget_name: body.budget_name,
    budget_start_date: new Date(body.budget_start_date),
    budget_end_date: new Date(body.budget_end_date),
    category_name: body.category_name,
    amount_limit: Number(body.amount_limit),
    budget_note: body.budget_note,
    notification_status: body.notification_status,
    alert_threshold: body.alert_threshold,
    total_spent,
    progress,
  });
};

export const fetchAllBudgets = async (user: User) => {
  const budgets = await Budget.find({ user_id: user?.sub });
  return budgets;
};
