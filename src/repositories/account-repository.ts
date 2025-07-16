import accountModel from "../models/postgres/account-model";
import { IAccount } from "../types";

const model = accountModel;

const create = async (data: IAccount) => {
  return await model.create(data);
};

const findOneByName = async (data: {
  user_id: string;
  account_name: string;
}) => {
  return await model.findOneByName(data);
};

const findByUserId = async (userId: string) => {
  return await model.findByUserId(userId);
};

const findOneById = async (id: string) => {
  return await model.findOneById(id);
};

const deleteMany = async (accountIds: string[]) => {
  return await model.deleteMany(accountIds);
};

const deleteOneById = async (accountId: string) => {
  return await model.deleteOneById(accountId);
};

const updateOneById = async (data: IAccount) => {
  return await model.updateOneById(data);
};

export default {
  create,
  findOneByName,
  findByUserId,
  deleteMany,
  deleteOneById,
  findOneById,
  updateOneById,
};
