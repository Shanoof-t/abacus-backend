import transactionModel from "../models/postgres/transaction-model";
import { ITransaction } from "../types/transaction-types";

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

const updateOneById = async (
  transactionId: string,
  transaction: ITransaction
): Promise<ITransaction> => {
  return await model.updateOneById(transaction, transactionId);
};

const insertMany = async (transactions: ITransaction[]): Promise<ITransaction[]> => {
  return await model.insertMany(transactions);
};

const findByCategoryAndType = async (details: {
  user_id: string;
  category_name: string;
  transaction_type: "expense" | "income";
}): Promise<ITransaction[]> => {
  return await model.findByCategoryAndType(details);
};

export default {
  create,
  findById,
  deleteMany,
  deleteOneById,
  findOneById,
  updateOneById,
  insertMany,
  findByCategoryAndType,
};
