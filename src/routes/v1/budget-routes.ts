import express from "express";
import authenticateToken from "../../middlewares/jwt-authentication-middleware";
import { addBudget, getAllBudgets } from "../../controllers/budget-controller";
import validator from "../../middlewares/validator-middleware";
import schema from "../../schema/budget-schema";

const budgetRouter = express.Router();

budgetRouter.use(authenticateToken);

budgetRouter
  .route("/")
  .post(validator(schema.add), addBudget)
  .get(getAllBudgets);

// budgetRouter.post("/bulk-delete", accountBulkDelete);

// budgetRouter
//   .route("/:id")
//   .delete(deleteAccount)
//   .put(editAccount)
//   .get(getAccount);

export default budgetRouter;
