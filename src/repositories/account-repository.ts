import accountModel from "../models/postgres/account-model";
import { IAccount } from "../types";

const model = accountModel;

const create = async (data: IAccount): Promise<IAccount> => {
  return await model.create(data);
};

const findOneByName = async (data: {
  user_id: string;
  account_name: string;
}): Promise<IAccount> => {
  return await model.findOneByName(data);
};

const findByUserId = async (userId: string): Promise<IAccount[]> => {
  return await model.findByUserId(userId);
};

const findOneById = async (id: string): Promise<IAccount> => {
  return await model.findOneById(id);
};

const findOneByUserAndSource = async (data: {
  userId: string;
  account_source: string;
}): Promise<IAccount[]> => {
  return await model.findOneByUserAndSource(data);
};

const deleteMany = async (accountIds: string[]): Promise<IAccount[]> => {
  return await model.deleteMany(accountIds);
};
const deleteManyBySource = async (data: {
  user_id: string;
  account_source: string;
}): Promise<IAccount[]> => {
  return await model.deleteManyBySource(data);
};

const deleteOneById = async (accountId: string): Promise<IAccount> => {
  return await model.deleteOneById(accountId);
};

const updateOneById = async (data: IAccount): Promise<IAccount> => {
  return await model.updateOneById(data);
};

const updateOneByUserId = async (data: {
  account_balance: number;
  user_id: string;
  account_name: string;
}): Promise<IAccount> => {
  return await model.updateOneByUserId(data);
};

export default {
  create,
  findOneByName,
  findByUserId,
  deleteMany,
  deleteOneById,
  findOneById,
  updateOneById,
  findOneByUserAndSource,
  updateOneByUserId,
  deleteManyBySource,
};
