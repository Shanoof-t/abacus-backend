import transactionModel from "../models/postgres/transaction-model";
import {
  IExpense,
  IIncome,
  IPeriodExpense,
  IPeriodIncome,
  ITransaction,
  ITransactionSummary,
} from "../types/transaction-types";

const model = transactionModel;

const create = async (transaction: ITransaction): Promise<ITransaction> => {
  return await model.create(transaction);
};

const findById = async (userId: string): Promise<ITransaction[]> => {
  return await model.findById(userId);
};

const findOneById = async (transactionId: string): Promise<ITransaction> => {
  return await model.findOneById(transactionId);
};

const deleteOneById = async (userId: string): Promise<ITransaction> => {
  return await model.deleteOneById(userId);
};

const deleteMany = async (userIds: string[]): Promise<ITransaction[]> => {
  return await model.deleteMany(userIds);
};

const deleteManyByBank = async (userId: string): Promise<ITransaction[]> => {
  return await model.deleteManyByBank(userId);
};

const updateOneById = async (
  transactionId: string,
  transaction: ITransaction
): Promise<ITransaction> => {
  return await model.updateOneById(transaction, transactionId);
};

const insertMany = async (
  transactions: ITransaction[]
): Promise<ITransaction[]> => {
  return await model.insertMany(transactions);
};

const findByType = async (details: {
  user_id: string;
  transaction_type: "expense" | "income";
}): Promise<ITransaction[]> => {
  return await model.findByType(details);
};

const findByCategoryAndType = async (details: {
  user_id: string;
  category_name: string;
  transaction_type: "expense" | "income";
}): Promise<ITransaction[]> => {
  return await model.findByCategoryAndType(details);
};

const findIncome = async (matchData: IIncome) => {
  return model.findIncome(matchData);
};

const findExpense = async (matchData: IExpense) => {
  return model.findExpense(matchData);
};

const findPreviousPeriodIncome = async (matchData: IPeriodIncome) => {
  return model.findPreviousPeriodIncome(matchData);
};

const findPreviousPeriodExpense = async (matchData: IPeriodExpense) => {
  return model.findPreviousPeriodExpense(matchData);
};

const findTransactionSummary = async (matchData: ITransactionSummary) => {
  return model.findTransactionSummary(matchData);
};

const findBankTransactionsWithAccount = async (data: {
  user_id: string;
  account_name: string;
  isBankTransaction: boolean;
}) => {
  return model.findBankTransactionsWithAccount(data);
};

export default {
  create,
  findById,
  deleteMany,
  deleteOneById,
  findOneById,
  updateOneById,
  insertMany,
  findByType,
  findByCategoryAndType,
  findIncome,
  findExpense,
  findPreviousPeriodIncome,
  findPreviousPeriodExpense,
  findTransactionSummary,
  findBankTransactionsWithAccount,
  deleteManyByBank,
};
