import budgetModel from "../models/postgres/budget-model";
import { IBudget } from "../types";

const model = budgetModel;

const create = async (data: IBudget): Promise<IBudget> => {
  return await model.create(data);
};

const findOneByName = async (data: {
  user_id: string;
  category_name: string;
}): Promise<IBudget> => {
  return await model.findOneByName(data);
};

const findByUserId = async (userId: string): Promise<IBudget[]> => {
  return await model.findByUserId(userId);
};

const findOneById = async (id: string): Promise<IBudget> => {
  return await model.findOneById(id);
};

const deleteOneById = async (id: string): Promise<IBudget> => {
  return await model.deleteOneById(id);
};

const update = async (data: IBudget): Promise<IBudget> => {
  return await model.update(data);
};

const updateProgress = async (data: {
  user_id: string;
  category_name: string;
  total_spent: number;
  progress: number;
}): Promise<IBudget> => {
  return await model.updateProgress(data);
};

export default {
  create,
  findOneByName,
  findByUserId,
  findOneById,
  deleteOneById,
  update,
  updateProgress,
};
