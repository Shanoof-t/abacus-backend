import express from "express";
import {
  accountBulkDelete,
  addAccount,
  getAllAccounts,
} from "../../controllers/account-controller";
import authenticateToken from "../../middlewares/jwt-authentication-middleware";

const accountRouter = express.Router();

accountRouter.use(authenticateToken);

accountRouter.post("/", addAccount).get("/", getAllAccounts)
accountRouter.post("/bulk-delete",accountBulkDelete)

export default accountRouter;
