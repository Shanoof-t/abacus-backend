import { Category } from "../models/mongodb/category-model";
import { ICreateCategory, User } from "../types";
import CustomError from "../utils/Custom-error";
import { ObjectId } from "mongodb";

export const createCategory = async (body: ICreateCategory, user?: User) => {
  const existingCategory = await Category.findOne({
    user_id: user?.sub,
    category_name: body.category_name,
  });

  if (existingCategory)
    throw new CustomError("This name with category is already created.", 400);

  await Category.create({
    user_id: user?.sub,
    category_name: body.category_name.replace(/\W/g, ""),
  });
};

export const fetchAllCategoriesByUserId = async (user?: User) => {
  return await Category.find({ user_id: user?.sub });
};

export const deleteCategories = async (categoryIds: string[]) => {
  const ids = categoryIds.map((id) => new ObjectId(id));
  await Category.deleteMany({ _id: { $in: ids } });
};

export const deleteCategoryById = async (id: string) => {
  await Category.deleteOne({ _id: id });
};

export const fetchCategoryById = async (id: string) => {
  const category = await Category.findOne({ _id: id });
  if (!category)
    throw new CustomError(`Can't find category with this id ${id}`, 400);
  return category;
};

export const editCategoryById = async (body: ICreateCategory, id: string) => {
  const existingCategory = await Category.findOne({
    category_name: body.category_name,
  });
  if (existingCategory)
    throw new CustomError(
      `Already an category existin with this name ${body.category_name}`,
      400
    );
  await Category.updateOne(
    { _id: id },
    { $set: { category_name: body.category_name } }
  );
};
