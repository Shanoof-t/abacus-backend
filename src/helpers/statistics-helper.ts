import { z } from "zod";
import { User as UserType } from "../middlewares/jwt-authentication-middleware";
import { Transaction } from "../models/transaction-model";
import { schema } from "../schema/statistics-schema";
import { Types } from "mongoose";
import { Category } from "../models/category-model";

type Body = z.infer<typeof schema.financialSummary>;
type User = UserType | undefined;

type MonthViseSummary = {
  _id: string;
  income: number;
  expense: number;
};

interface GetIncomeMatchStage {
  user_id: Types.ObjectId | undefined;
  transaction_date: {
    $gte: Date;
    $lte: Date;
  };
  transaction_type: string;
  account_name?: string;
}
interface GetExpenseMatchStage extends GetIncomeMatchStage {}
interface GetPastMonthIncomeMatchStage extends GetIncomeMatchStage {}
interface GetPastMonthExpenseMatchStage extends GetPastMonthIncomeMatchStage {}
interface GetTransactionHistoryMatchStage
  extends Omit<GetPastMonthIncomeMatchStage, "transaction_type"> {}

export default {
  getIncome: async (body: Body, user: User) => {
    const matchStage: GetIncomeMatchStage = {
      user_id: user?.sub,
      transaction_date: {
        $gte: new Date(body.from),
        $lte: new Date(body.to),
      },
      transaction_type: "income",
    };

    if (body.account) {
      matchStage.account_name = body.account;
    }

    const income = await Transaction.aggregate([
      {
        $match: matchStage,
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
    const matchStage: GetExpenseMatchStage = {
      user_id: user?.sub,
      transaction_date: {
        $gte: new Date(body.from),
        $lte: new Date(body.to),
      },
      transaction_type: "expense",
    };

    if (body.account) {
      matchStage.account_name = body.account;
    }
    const expense = await Transaction.aggregate([
      {
        $match: matchStage,
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
    accountName,
  }: {
    user: User;
    currentMonth: string;
    previouseMonth: string;
    accountName?: string;
  }) => {
    const matchStage: GetPastMonthIncomeMatchStage = {
      user_id: user?.sub,
      transaction_date: {
        $gte: new Date(previouseMonth),
        $lte: new Date(currentMonth),
      },
      transaction_type: "income",
    };
    if (accountName) {
      matchStage.account_name = accountName;
    }
    const pastMonthIncome = await Transaction.aggregate([
      {
        $match: matchStage,
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
    accountName,
  }: {
    user: User;
    currentMonth: string;
    previouseMonth: string;
    accountName?: string;
  }) => {
    const matchStage: GetPastMonthExpenseMatchStage = {
      user_id: user?.sub,

      transaction_date: {
        $gte: new Date(previouseMonth),
        $lte: new Date(currentMonth),
      },
      transaction_type: "expense",
    };

    if (accountName) {
      matchStage.account_name = accountName;
    }
    const pastMonthExpense = await Transaction.aggregate([
      {
        $match: matchStage,
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
  getTransactionSummary: async ({
    user,
    body,
  }: {
    user: User;
    body: Body;
  }): Promise<MonthViseSummary[]> => {
    const matchStage: GetTransactionHistoryMatchStage = {
      user_id: user?.sub,
      transaction_date: {
        $gte: new Date(body.from),
        $lte: new Date(body.to),
      },
    };

    if (body.account) {
      matchStage.account_name = body.account;
    }

    return await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$transaction_date",
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
  },
  getCategory: async ({ user }: { user: User }) => {
    const transactions = await Transaction.find({
      user_id: user?.sub,
      transaction_type: "expense",
    });

    const categoriesMap = new Map();

    transactions.forEach(({ category_name, transaction_amount }, index) => {
      if (categoriesMap.has(category_name)) {
        const currentCategory = categoriesMap.get(category_name);
        const updatedCategory = {
          ...currentCategory,
          category_amount:
            currentCategory.category_amount + transaction_amount,
        };
        categoriesMap.set(category_name, updatedCategory);
      } else {
        const obj = {
          _id: index,
          category_name,
          category_amount: transaction_amount,
        };
        categoriesMap.set(category_name, obj);
      }
    });


    const categories = Array.from(categoriesMap.values());
    return categories;
  },
};
