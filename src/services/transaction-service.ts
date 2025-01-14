import { Types } from "mongoose";
import { Transaction } from "../models/transaction-model";
import { Body } from "../types/transaction-types";
import { z } from "zod";
import schema from "../schema/transaction-schema";
import { ObjectId } from "mongodb";
import CustomError from "../utils/Custom-error";
import { Budget } from "../models/budget-model";
import budgetHelper from "../helpers/budget-helper";
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

  if (transaction.transaction_type === "expense") {
    await budgetHelper.updateBudgetAfterTransaction({
      user_id: user?.sub,
      category_name,
    });
  }

  return transaction;
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
