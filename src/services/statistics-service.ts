import { z } from "zod";
import { schema } from "../schema/statistics-schema";
import statisticsHelper from "../helpers/statistics-helper";
import { subMonths } from "date-fns";
import { Category } from "../models/mongodb/category-model";
import { User } from "../types";
import CustomError from "../utils/Custom-error";

type CreateSummary = z.infer<typeof schema.financialSummary>;

export const createSummary = async (body: CreateSummary, user?: User) => {
  if (!user) throw new CustomError("user is not exist,", 400);

  const income = await statisticsHelper.getIncome(body, user);
  const expense = await statisticsHelper.getExpense(body, user);
  const remaining = income - expense;

  const currentMonth = body.from;
  const previouseMonth = subMonths(currentMonth, 1).toISOString();
  const accountName = body.account;
  const pastMonthIncome = await statisticsHelper.getPastMonthIncome({
    currentMonth,
    previouseMonth,
    accountName,
    user,
  });

  const pastMonthExpense = await statisticsHelper.getPastMonthExpense({
    currentMonth,
    previouseMonth,
    accountName,
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

  const clamp = (value: number) => Math.min(Math.max(value, 100), 100);
  return {
    income,
    expense,
    remaining,
    pastMonthIncomePercentage: Math.round(clamp(pastMonthIncomePercentage)),
    pastMonthExpensePercentage: Math.round(clamp(pastMonthExpensePercentage)),
    pastMonthRemainingPercentage: Math.round(
      clamp(pastMonthRemainingPercentage)
    ),
  };
};

export const fetchFinancialHistory = async ({
  user,
  body,
}: {
  user?: User;
  body: CreateSummary;
}) => {
  if (!user) throw new CustomError("user is not exist,", 400);

  const transactionSummary = await statisticsHelper.getTransactionSummary({
    user,
    body,
  });

  const formatedTransactionSummary = transactionSummary.map((month) => {
    return {
      ...month,
      date: month._id,
      expense: Math.abs(month.expense),
    };
  });

  const categories = await statisticsHelper.getCategory({ user });
  const data = {
    transaction: formatedTransactionSummary,
    categories,
  };
  return data;
};
