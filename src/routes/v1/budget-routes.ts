import express from "express";
import authenticateToken from "../../middlewares/jwt-authentication-middleware";
import {
  addBudget,
  deleteBudget,
  getAllBudgets,
  getBudget,
  getBudgetByCategory,
  updateBudget,
} from "../../controllers/budget-controller";
import validator from "../../middlewares/validator-middleware";
import schema from "../../schema/budget-schema";

const budgetRouter = express.Router();

budgetRouter.use(authenticateToken);

budgetRouter
  .route("/")
  .post(validator(schema.add), addBudget)
  .get(getAllBudgets);

budgetRouter.route("/category/:category").get(getBudgetByCategory);

budgetRouter
  .route("/:id")
  .get(getBudget)
  .delete(deleteBudget)
  .put(updateBudget);

// budgetRouter.post("/bulk-delete", accountBulkDelete);

export default budgetRouter;
