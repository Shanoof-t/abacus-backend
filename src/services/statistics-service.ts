import { z } from "zod";
import { User as UserType } from "../middlewares/jwt-authentication-middleware";
import { schema } from "../schema/statistics-schema";
import { Transaction } from "../models/transaction-model";
import statisticsHelper from "../helpers/statistics-helper";
import { subMonths } from "date-fns";

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
    ((pastMonthExpense - pastMonthIncome) / pastMonthIncome) * -100;
  const pastMonthExpensePercentage =
    ((pastMonthIncome - pastMonthExpense) / pastMonthExpense) * -100;
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
