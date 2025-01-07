import express from "express";
import {
  accountBulkDelete,
  addAccount,
  deleteAccount,
  editAccount,
  getAccount,
  getAllAccounts,
} from "../../controllers/account-controller";
import authenticateToken from "../../middlewares/jwt-authentication-middleware";

const accountRouter = express.Router();

accountRouter.use(authenticateToken);

accountRouter.route("/").post(addAccount).get(getAllAccounts);

accountRouter.post("/bulk-delete", accountBulkDelete);

accountRouter
  .route("/:id")
  .delete(deleteAccount)
  .put(editAccount)
  .get(getAccount);

export default accountRouter;
