import express from "express";
import authenticateToken from "../../middlewares/jwt-authentication-middleware";
import {
  addCategory,
  categoryBulkDelete,
  deleteCategory,
  editCategory,
  getAllCategories,
  getCategory,
} from "../../controllers/category-controller";

const categoryRouter = express.Router();

categoryRouter.use(authenticateToken);

categoryRouter.route("/").post(addCategory).get(getAllCategories);

categoryRouter.route("/bulk-delete").post(categoryBulkDelete);

categoryRouter.route("/:id").delete(deleteCategory).get(getCategory).put(editCategory)

export default categoryRouter;
