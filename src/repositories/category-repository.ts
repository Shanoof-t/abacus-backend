import categoryModel from "../models/postgres/category-model";
import { ICategory } from "../types";

const model = categoryModel;

const findOneById = async (id: string): Promise<ICategory> => {
  return model.findOneById(id);
};

const findOneByName = async (data: ICategory): Promise<ICategory> => {
  return model.findOneByName(data);
};

const findByUserId = async (userId: string): Promise<ICategory[]> => {
  return model.findByUserId(userId);
};
const create = async (data: ICategory): Promise<ICategory> => {
  return model.create(data);
};

const deleteMany = async (categoryIds: string[]): Promise<ICategory[]> => {
  return model.deleteMany(categoryIds);
};

const deleteOneById = async (id: string): Promise<ICategory> => {
  return model.deleteOneById(id);
};

const updateOneById = async (data: ICategory): Promise<ICategory> => {
  return model.updateOneById(data);
};

export default {
  findOneById,
  findOneByName,
  create,
  findByUserId,
  deleteMany,
  deleteOneById,
  updateOneById,
};
