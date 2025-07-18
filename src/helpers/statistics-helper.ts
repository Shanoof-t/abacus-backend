import { z } from "zod";
import { schema } from "../schema/statistics-schema";
import {
  IExpense,
  IIncome,
  IPeriodExpense,
  IPeriodIncome,
  ITransactionSummary,
  User,
  IMonthViseSummary,
} from "../types";
import transactionRepository from "../repositories/transaction-repository";

type Body = z.infer<typeof schema.financialSummary>;

export default {
  getIncome: async (body: Body, user: User) => {
    const matchData: IIncome = {
      user_id: user.sub,
      fromDate: body.from,
      toDate: body.to,
      transaction_type: "income",
    };

    if (body.account) {
      matchData.account_name = body.account;
    }

    const income = await transactionRepository.findIncome(matchData);
    if (income) {
      return income.income;
    } else {
      return 0;
    }
  },
  getExpense: async (body: Body, user: User) => {
    const matchData: IExpense = {
      user_id: user.sub,
      fromDate: body.from,
      toDate: body.to,
      transaction_type: "expense",
    };

    if (body.account) {
      matchData.account_name = body.account;
    }

    const expense = await transactionRepository.findExpense(matchData);
    if (expense) {
      return expense.expense;
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
    const matchData: IPeriodIncome = {
      user_id: user?.sub,
      currentMonth,
      previouseMonth,
      transaction_type: "income",
    };

    if (accountName) {
      matchData.account_name = accountName;
    }

    const pastMonthIncome =
      await transactionRepository.findPreviousPeriodIncome(matchData);
    return pastMonthIncome ? pastMonthIncome.income : 0;
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
    const matchData: IPeriodExpense = {
      user_id: user?.sub,
      currentMonth,
      previouseMonth,
      transaction_type: "expense",
    };

    if (accountName) {
      matchData.account_name = accountName;
    }

    const pastMonthExpense =
      await transactionRepository.findPreviousPeriodExpense(matchData);

    return pastMonthExpense ? pastMonthExpense.expense : 0;
  },
  getTransactionSummary: async ({
    user,
    body,
  }: {
    user: User;
    body: Body;
  }): Promise<IMonthViseSummary[]> => {
    const matchData: ITransactionSummary = {
      user_id: user.sub,
      fromDate: body.from,
      toDate: body.to,
    };

    if (body.account) {
      matchData.account_name = body.account;
    }

    return await transactionRepository.findTransactionSummary(matchData);
  },
  getCategory: async ({ user }: { user: User }) => {
    const transactions = await transactionRepository.findByType({
      user_id: user.sub,
      transaction_type: "expense",
    });

    const categoriesMap = new Map();

    transactions.forEach(({ category_name, transaction_amount }, index) => {
      if (categoriesMap.has(category_name)) {
        const currentCategory = categoriesMap.get(category_name);
        const updatedCategory = {
          ...currentCategory,
          category_amount: currentCategory.category_amount + transaction_amount,
        };
        categoriesMap.set(category_name, updatedCategory);
      } else {
        const obj = {
          id: index + 1,
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
