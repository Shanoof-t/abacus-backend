import { z } from "zod";
import { User as UserType } from "../middlewares/jwt-authentication-middleware";
import { schema } from "../schema/statistics-schema";
import statisticsHelper from "../helpers/statistics-helper";
import { subMonths } from "date-fns";
import { Category } from "../models/category-model";

type User = UserType | undefined;

type CreateSummary = z.infer<typeof schema.financialSummary>;

export const createSummary = async (user: User, body: CreateSummary) => {
  const income = await statisticsHelper.getIncome(body, user);
  const expense = await statisticsHelper.getExpense(body, user);
  const remaining = income - expense;

  const currentMonth = body.from;
  const previouseMonth = subMonths(currentMonth, 1).toISOString();

  const pastMonthIncome = await statisticsHelper.getPastMonthIncome({
    currentMonth,
    previouseMonth,
    user,
  });

  const pastMonthExpense = await statisticsHelper.getPastMonthExpense({
    currentMonth,
    previouseMonth,
    user,
  });

  const pastMonthRemaining = pastMonthIncome - pastMonthExpense;
  const pastMonthIncomePercentage =
    ((pastMonthIncome - income) / income) * -100;
  const pastMonthExpensePercentage =
    ((pastMonthExpense - expense) / expense) * -100;
  const pastMonthRemainingPercentage =
    ((Math.abs(pastMonthRemaining) - Math.abs(remaining)) /
      Math.abs(remaining)) *
    -100;

  return {
    income,
    expense,
    remaining,
    pastMonthIncomePercentage: Math.round(pastMonthIncomePercentage),
    pastMonthExpensePercentage: Math.round(pastMonthExpensePercentage),
    pastMonthRemainingPercentage: Math.round(pastMonthRemainingPercentage),
  };
};

export const fetchFinancialHistory = async (user: User) => {
  const transactionSummary = await statisticsHelper.getTransactionSummary(user);

  const formatedTransactionSummary = transactionSummary.map((month) => {
    return {
      ...month,
      date: month._id,
      expense: Math.abs(month.expense),
    };
  });
  const categories = await Category.find();
  const data = {
    transaction: formatedTransactionSummary,
    categories,
  };
  return data;
};
