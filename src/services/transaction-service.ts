import { Types } from "mongoose";
import { Transaction } from "../models/transaction-model";
import { z } from "zod";
import schema from "../schema/transaction-schema";
import { ObjectId } from "mongodb";
import CustomError from "../utils/Custom-error";
import { Category } from "../models/category-model";
import categoryHelper from "../helpers/category-helper";

import transactionHelper, {
  TransactionType,
} from "../helpers/transaction-helper";

interface User {
  sub?: Types.ObjectId;
  email?: string;
}

export const createTransaction = async (
  body: z.infer<typeof schema.add>,
  user: User | undefined
) => {
  const {
    account_name,
    category_name,
    transaction_amount,
    transaction_date,
    transaction_payee,
    transaction_note,
    is_recurring,
    recurring_frequency,
    transaction_type,
  } = body;

  const transaction: TransactionType = await Transaction.create({
    user_id: user?.sub,
    transaction_date,
    account_name,
    transaction_amount: parseFloat(transaction_amount),
    category_name,
    transaction_payee,
    transaction_type,
    transaction_note,
  });

  if (is_recurring) {
    // // set next date
    // const next_date = transactionHelper.calculateNextRecurringDate({
    //   recurring_frequency,
    //   transaction_date,
    // });

    // transaction.is_estimated = true;
    // transaction.is_recurring = is_recurring;
    // transaction.recurring = { recurring_frequency, next_date };
    // await transaction.save();

    // if (next_date) {
    //   const cronExpression = transactionHelper.formatCornExpression({
    //     next_date,
    //   });
    //   await transactionHelper.scheduleRecurringNotification({
    //     category_name,
    //     cronExpression,
    //     recurring_frequency,
    //     transaction_amount,
    //     transaction_type,
    //     user,
    //   });
    // }

    await transactionHelper.handleRecurring({
      category_name,
      is_recurring,
      transaction,
      transaction_amount,
      transaction_type,
      user,
      recurring_frequency,
      transaction_date,
    });
  }

  // update category amount based on transaction

  await Category.updateOne(
    { category_name },
    { $inc: { category_amount: Math.abs(parseFloat(transaction_amount)) } }
  );

  // update budget
  if (transaction.transaction_type === "expense") {
    const alert = await transactionHelper.handleBudgetUpdateAndCreateAlerts({
      category_name,
      transaction_amount,
      user,
    });

    if (alert) {
      return { alert, transaction };
    }
  }

  return { transaction };
};

export const fetchAllTransactions = async (user: User | undefined) => {
  const transactions = await Transaction.find({ user_id: user?.sub });
  return transactions;
};

export const deleteTransactions = async (body: string[]) => {
  const ids = body.map((id) => new ObjectId(id));
  await Transaction.deleteMany({ _id: { $in: ids } });
};

export const deleteTransactionById = async (id: string) => {
  const deletedResult = await Transaction.deleteOne({ _id: id });
  if (deletedResult.deletedCount === 0)
    throw new CustomError("Can't delete transaction,", 400);
};

export const fetchTransactionById = async (id: string) => {
  const transaction = await Transaction.findOne({ _id: id });
  if (!transaction) throw new CustomError("Can't find transaction.", 400);
  return transaction;
};

export const editTransactionById = async (
  body: z.infer<typeof schema.add>,
  user: User | undefined,
  id: string
) => {
  const transaction_type =
    parseFloat(body.transaction_amount) > 0 ? "income" : "expense";

  await Transaction.updateOne(
    { _id: id },
    {
      $set: {
        account_name: body.account_name,
        category_name: body.category_name,
        transaction_amount: parseFloat(body.transaction_amount),
        transaction_date: body.transaction_date,
        transaction_payee: body.transaction_payee,
        transaction_note: body.transaction_note,
        transaction_type,
      },
    }
  );
};

type CreateTransactions = {
  body: z.infer<typeof schema.add>[];
  user: User | undefined;
};

export const createTransactions = async ({
  body,
  user,
}: CreateTransactions) => {
  const user_id = user?.sub;

  const adjustedTransactions = body.map((transaction) => {
    const transaction_type =
      parseFloat(transaction.transaction_amount) > 0 ? "income" : "expense";

    return {
      ...transaction,
      user_id,
      transaction_type,
      transaction_amount: parseFloat(transaction.transaction_amount),
    };
  });

  // check category
  await categoryHelper.createCategories({ transactions: body, user });

  await Transaction.insertMany(adjustedTransactions);
};
