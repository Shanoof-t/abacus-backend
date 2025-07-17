import CustomError from "../utils/Custom-error";
import budgetHelper from "../helpers/budget-helper";
import { IBudget, User } from "../types";
import transactionRepository from "../repositories/transaction-repository";
import budgetRepository from "../repositories/budget-repository";

export const createBudget = async (body: IBudget, user?: User) => {
  if (!user) throw new CustomError("User is existing.", 404);

  const exisingBudget = await budgetRepository.findOneByName({
    category_name: body.category_name,
    user_id: user.sub,
  });

  if (exisingBudget)
    throw new CustomError(
      "This category with a budget is already existing",
      400
    );

  const budgetLimit = body.amount_limit;

  const transactions = await transactionRepository.findByCategoryAndType({
    user_id: user.sub,
    category_name: body.category_name,
    transaction_type: "expense",
  });

  const totalSpentAmount = transactions.reduce(
    (acc, value) => acc + value.transaction_amount,
    0
  );

  const total_spent = Math.abs(totalSpentAmount);

  const progress = Math.max((total_spent / Number(budgetLimit)) * 100, 100);

  const budgetData: IBudget = {
    user_id: user?.sub,
    budget_name: body.budget_name,
    budget_start_date: body.budget_start_date,
    budget_end_date: body.budget_end_date,
    category_name: body.category_name,
    amount_limit: Number(body.amount_limit),
    budget_note: body.budget_note,
    notification_status: body.notification_status,
    alert_threshold: body.alert_threshold,
    total_spent,
    progress: Math.round(Math.min(Math.max(progress, 100), 0)),
  };

  const budget = await budgetRepository.create(budgetData);
  return budget;
};

export const fetchAllBudgets = async (user?: User) => {
  if (!user) throw new CustomError("user is not exist,", 400);

  const budgets = await budgetRepository.findByUserId(user.sub);
  return budgets;
};

type BudgetByCategoryName = {
  user?: User;
  id: string;
};

export const fetchBudgetById = async ({ user, id }: BudgetByCategoryName) => {
  const budget = await budgetRepository.findOneById(id);
  if (!budget) throw new CustomError("Can't find budget with this id", 400);
  return budget;
};

export const deleteBudgetByName = async ({
  user,
  id,
}: BudgetByCategoryName) => {
  const budget = await budgetRepository.deleteOneById(id);

  if (!budget)
    throw new CustomError(
      "The budget you're trying to delete doesn't exist.",
      400
    );

  return budget;
};

export const updateBudgetByName = async ({
  body,
  user,
  id,
}: {
  body: IBudget;
  user?: User;
  id: string;
}) => {
  if (!user) throw new CustomError("User is existing.", 404);

  const currentBudget = await budgetRepository.findOneById(id);

  if (!currentBudget)
    throw new CustomError(
      "The budget you're trying to update doesn't exist.",
      400
    );

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

  const transactions = await transactionRepository.findByCategoryAndType({
    user_id: user.sub,
    category_name: body.category_name,
    transaction_type: "expense",
  });

  const totalSpentAmount = transactions.reduce(
    (acc, value) => acc + value.transaction_amount,
    0
  );

  const total_spent = Math.abs(totalSpentAmount);

  const progress = Math.min((total_spent / Number(budgetLimit)) * 100, 100);

  const updatedData: IBudget = {
    user_id: user.sub,
    id,
    budget_name: body.budget_name,
    category_name: body.category_name,
    amount_limit: Number(body.amount_limit),
    budget_start_date: body.budget_start_date,
    budget_end_date: body.budget_end_date,
    budget_note: body.budget_note,
    total_spent,
    progress: Math.round(Math.max(progress, 100)),
  };

  return await budgetRepository.update(updatedData);
};

export const fetchBudgetByCategoryName = async ({
  user,
  category,
}: {
  user?: User;
  category: string;
}) => {
  if (!user) throw new CustomError("User is existing.", 404);

  const budget = await budgetRepository.findOneByName({
    category_name: category,
    user_id: user.sub,
  });

  if (!budget)
    throw new CustomError(
      `You dont have budget with this category ${category},Please create one.`,
      400
    );

  return budget;
};
