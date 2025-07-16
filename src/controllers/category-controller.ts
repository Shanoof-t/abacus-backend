import {
  createCategory,
  deleteCategories,
  deleteCategoryById,
  editCategoryById,
  fetchAllCategoriesByUserId,
  fetchCategoryById,
} from "../services/category-service";
import { asyncErrorHandler } from "../utils/error-handlers";

export const addCategory = asyncErrorHandler(async (req, res) => {
  const { body, user } = req;

  await createCategory(body, user);
  res
    .status(201)
    .json({ status: "success", message: "Category created successfully" });
});

export const getAllCategories = asyncErrorHandler(async (req, res) => {
  const { user } = req;
  const categories = await fetchAllCategoriesByUserId(user);

  res.status(200).json({
    status: "success",
    message: "Successfully fetched all categories.",
    data: categories,
  });
});

export const categoryBulkDelete = asyncErrorHandler(async (req, res) => {
  const { body } = req;
  await deleteCategories(body);
  res
    .status(200)
    .json({ status: "success", message: "Categories delete successfull." });
});

export const deleteCategory = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  await deleteCategoryById(id);
  res
    .status(200)
    .json({ status: "success", message: "Category deleted successfully." });
});

export const getCategory = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const category = await fetchCategoryById(id);
  res.status(200).json({
    status: "success",
    message: "Category fetch successfull.",
    data: category,
  });
});

export const editCategory = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  await editCategoryById(body, id);
  res.status(200).json({
    status: "success",
    message: "Category edited successfully.",
  });
});
