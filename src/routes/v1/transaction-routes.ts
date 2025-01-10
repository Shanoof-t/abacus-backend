import express from "express";
import {
  addTransaction,
  deleteBulkTransactions,
  deleteTransaction,
  editTransaction,
  getAllTransactions,
  getTransaction,
} from "../../controllers/transaction-controller";
import validator from "../../middlewares/validator-middleware";
import schema from "../../schema/transaction-schema";
import authenticateToken from "../../middlewares/jwt-authentication-middleware";

const transactionRoute = express.Router();

transactionRoute.use(authenticateToken);

transactionRoute
  .route("/")
  .post(validator(schema.add), addTransaction)
  .get(getAllTransactions);

transactionRoute.route("/bulk-delete").post(deleteBulkTransactions);

transactionRoute
  .route("/:id")
  .delete(deleteTransaction)
  .get(getTransaction)
  .put(editTransaction);

export default transactionRoute;
