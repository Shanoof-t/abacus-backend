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

  const data = await createCategory(body, user);

  res.status(201).json({
    status: "success",
    message: "Category created successfully",
    data,
  });
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
  const data = await deleteCategories(body);
  res
    .status(200)
    .json({
      status: "success",
      message: "Categories delete successfull.",
      data,
    });
});

export const deleteCategory = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const data = await deleteCategoryById(id);
  res.status(200).json({
    status: "success",
    message: "Category deleted successfully.",
    data,
  });
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
  const user = req.user;
  const { id } = req.params;
  const { body } = req;
  const data = await editCategoryById(body, id, user);
  res.status(200).json({
    status: "success",
    message: "Category edited successfully.",
    data,
  });
});
