import categoryRepository from "../repositories/category-repository";
import { ICategory, User } from "../types";
import CustomError from "../utils/Custom-error";

export const createCategory = async (body: ICategory, user?: User) => {
  if (!user) throw new CustomError("user is not exist,", 400);

  const existingCategory = await categoryRepository.findOneByName({
    user_id: user.sub,
    category_name: body.category_name,
  });

  if (existingCategory)
    throw new CustomError("This name with category is already created.", 400);

  return await categoryRepository.create({
    category_name: body.category_name.replace(/\W/g, ""),
    user_id: user.sub,
  });
};

export const fetchAllCategoriesByUserId = async (user?: User) => {
  if (!user) throw new CustomError("user is not exist,", 400);

  return await categoryRepository.findByUserId(user?.sub);
};

export const deleteCategories = async (categoryIds: string[]) => {
  return await categoryRepository.deleteMany(categoryIds);
};

export const deleteCategoryById = async (id: string) => {
  const category = await categoryRepository.findOneById(id);
  if (!category)
    throw new CustomError(`Can't find category with this id ${id}`, 400);
  return await categoryRepository.deleteOneById(id);
};

export const fetchCategoryById = async (id: string) => {
  const category = await categoryRepository.findOneById(id);
  if (!category)
    throw new CustomError(`Can't find category with this id ${id}`, 400);
  return category;
};

export const editCategoryById = async (
  body: ICategory,
  id: string,
  user?: User
) => {
  if (!user) throw new CustomError("user is not exist,", 400);

  const currentCategory = await categoryRepository.findOneById(id);
  if (!currentCategory)
    throw new CustomError("The Category is not existing.", 400);
  const existingCategory = await categoryRepository.findOneByName({
    category_name: body.category_name,
    user_id: user.sub,
  });

  if (existingCategory)
    throw new CustomError(
      `Already an category existin with this name ${body.category_name}`,
      400
    );

  return await categoryRepository.updateOneById({
    category_name: body.category_name,
    id,
  });
};
