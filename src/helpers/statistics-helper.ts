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
          transaction_date: { $gte: body.from, $lte: body.to },
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
    return income[0] && income[0].income;
  },
  getExpense: async (body: Body, user: User) => {
    const expense = await Transaction.aggregate([
      {
        $match: {
          user_id: user?.sub,
          transaction_date: { $gte: body.from, $lte: body.to },
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
    return expense[0] && Math.abs(expense[0].expense);
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
          transaction_date: { $gte: previouseMonth, $lte: currentMonth },
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
    return pastMonthIncome[0] && pastMonthIncome[0].income;
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
          transaction_date: { $gte: previouseMonth, $lte: currentMonth },
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
    return pastMonthExpense[0] && Math.abs(pastMonthExpense[0].expense);
  },
};
