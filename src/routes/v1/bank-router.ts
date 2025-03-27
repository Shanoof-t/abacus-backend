import express from "express";
import {
  createSetuConsent,
  fetchTransactions,
} from "../../controllers/bank-controller";
import authenticateSetuToken from "../../middlewares/setu-token-middleware";
import authenticateToken from "../../middlewares/jwt-authentication-middleware";

const bankRouter = express.Router();

bankRouter.use(authenticateToken, authenticateSetuToken);
bankRouter.route("/consent/create/:mobileNo").get(createSetuConsent);
bankRouter.route("/consent/:id").get(fetchTransactions);

export default bankRouter;
