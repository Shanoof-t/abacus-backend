import { Types } from "mongoose";
import { Transaction } from "../models/transaction-model";
import { Body } from "../types/transaction-types";
import { z } from "zod";
import schema from "../schema/transaction-schema";
import { ObjectId } from "mongodb";
import CustomError from "../utils/Custom-error";
import { Budget } from "../models/budget-model";
import budgetHelper from "../helpers/budget-helper";
import { Category } from "../models/category-model";
import categoryHelper from "../helpers/category-helper";
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
  } = body;

  // if(is_recurring){
  //   const next_date =
  // }

  const transaction_type =
    parseFloat(transaction_amount) > 0 ? "income" : "expense";

  const transaction = await Transaction.create({
    user_id: user?.sub,
    transaction_date,
    account_name,
    transaction_amount: parseFloat(transaction_amount),
    category_name,
    transaction_payee,
    transaction_type,
    transaction_note,

    // is_estimated: true,
    // is_recurring,
    // recurring: { frequency },
  });

  // update category amount based on transaction
  const amount = Math.abs(parseFloat(transaction_amount));

  await Category.updateOne(
    { category_name },
    { $inc: { category_amount: amount } }
  );

  // update budget
  if (transaction.transaction_type === "expense") {
    await budgetHelper.updateBudgetAfterTransaction({
      user_id: user?.sub,
      category_name,
    });

    const updatedBudget = await budgetHelper.findOneBudgetWithCategory({
      user_id: user?.sub,
      category_name,
    });

    if (updatedBudget?.progress && updatedBudget?.progress >= 100) {
      const alertMessage = `Your exceeded ${category_name} by ${updatedBudget.total_spent}`;
      return { alertMessage, transaction };
    }
    
    if (
      updatedBudget?.alert_threshold &&
      updatedBudget?.progress &&
      updatedBudget.progress >= updatedBudget.alert_threshold
    ) {
      const alertMessage = `Your ${category_name} budget is nearing its limit. You’ve spent ${updatedBudget.total_spent}, which is close to the alert threshold of ${updatedBudget.alert_threshold}.`;
      return { alertMessage, transaction };
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
