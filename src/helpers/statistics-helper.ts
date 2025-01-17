import { z } from "zod";
import { User as UserType } from "../middlewares/jwt-authentication-middleware";
import { Transaction } from "../models/transaction-model";
import { schema } from "../schema/statistics-schema";

type Body = z.infer<typeof schema.financialSummary>;
type User = UserType | undefined;
export default {
  getIncome: async (body: Body, user: User) => {
    const income = await Transaction.aggregate([
      {
        $match: {
          user_id: user?.sub,
          transaction_date: {
            $gte: new Date(body.from),
            $lte: new Date(body.to),
          },
          transaction_type: "income",
        },
      },
      {
        $group: {
          _id: "$transaction_type",
          income: { $sum: "$transaction_amount" },
        },
      },
    ]);

    if (income) {
      return income[0] && income[0].income;
    } else {
      return 0;
    }
  },
  getExpense: async (body: Body, user: User) => {
    const expense = await Transaction.aggregate([
      {
        $match: {
          user_id: user?.sub,
          transaction_date: {
            $gte: new Date(body.from),
            $lte: new Date(body.to),
          },
          transaction_type: "expense",
        },
      },
      {
        $group: {
          _id: "$transaction_type",
          expense: { $sum: "$transaction_amount" },
        },
      },
    ]);
    if (expense) {
      return expense[0] && Math.abs(expense[0].expense);
    } else {
      return 0;
    }
  },
  getPastMonthIncome: async ({
    user,
    previouseMonth,
    currentMonth,
  }: {
    user: User;
    currentMonth: Date;
    previouseMonth: string;
  }) => {
    const pastMonthIncome = await Transaction.aggregate([
      {
        $match: {
          user_id: user?.sub,
          transaction_date: {
            $gte: new Date(previouseMonth),
            $lte: new Date(currentMonth),
          },
          transaction_type: "income",
        },
      },
      {
        $group: {
          _id: "$transaction_type",
          income: { $sum: "$transaction_amount" },
        },
      },
    ]);

    if (pastMonthIncome.length > 0) {
      return pastMonthIncome[0] && pastMonthIncome[0].income;
    } else {
      return 0;
    }
  },
  getPastMonthExpense: async ({
    user,
    previouseMonth,
    currentMonth,
  }: {
    user: User;
    currentMonth: Date;
    previouseMonth: string;
  }) => {
    const pastMonthExpense = await Transaction.aggregate([
      {
        $match: {
          user_id: user?.sub,
          transaction_date: {
            $gte: new Date(previouseMonth),
            $lte: currentMonth,
          },
          transaction_type: "expense",
        },
      },
      {
        $group: {
          _id: "$transaction_type",
          expense: { $sum: "$transaction_amount" },
        },
      },
    ]);

    if (pastMonthExpense.length > 0) {
      return pastMonthExpense[0] && Math.abs(pastMonthExpense[0].expense);
    } else {
      return 0;
    }
  },
};
