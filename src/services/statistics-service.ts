import { z } from "zod";
import { User as UserType } from "../middlewares/jwt-authentication-middleware";
import { schema } from "../schema/statistics-schema";
import { Transaction } from "../models/transaction-model";
import statisticsHelper from "../helpers/statistics-helper";
import { format, subMonths } from "date-fns";

type User = UserType | undefined;

type CreateSummary = z.infer<typeof schema.financialSummary>;

export const createSummary = async (user: User, body: CreateSummary) => {
  // const toDate = new Date(body.to);
  // const fromDate = new Date(body.to);

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
  // const transactions = await Transaction.find({ user_id: user?.sub });
  // const result = transactions.map((transaction) => {
  //   return {
  //     date: format(transaction.transaction_date, "MM MMM"),
  //     income:
  //       transaction.transaction_type === "income"
  //         ? transaction.transaction_amount
  //         : 0,
  //     expense:
  //       transaction.transaction_type === "expense"
  //         ? transaction.transaction_amount
  //         : 0,
  //   };
  // });

  const result = await Transaction.aggregate([
    { $match: { user_id: user?.sub } },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%m",
            date: "$transaction_date",
            timezone: "Asia/Kolkata",
          },
        },
        income: {
          $sum: {
            $cond: {
              if: { $eq: ["$transaction_type", "income"] },
              then: "$transaction_amount",
              else: 0,
            },
          },
        },
        expense: {
          $sum: {
            $cond: {
              if: { $eq: ["$transaction_type", "expense"] },
              then: "$transaction_amount",
              else: 0,
            },
          },
        },
      },
    },
  ]);

  // console.log(result);
};
