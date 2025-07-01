import { User as UserType } from "../middlewares/jwt-authentication-middleware";
import { Category } from "../models/category-model";
import CustomError from "../utils/Custom-error";
import { ObjectId } from "mongodb";

type CreateCategory = { category_name: string };

export const createCategory = async (
  body: CreateCategory,
  user: UserType | undefined
) => {
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

export const fetchAllCategoriesByUserId = async (
  user: UserType | undefined
) => {
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

export const editCategoryById = async (body: CreateCategory, id: string) => {
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
