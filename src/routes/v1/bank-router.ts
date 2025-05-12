import express from "express";
import {
  createSetuConsent,
  // fetchTransactions,
  setuNotifications,
} from "../../controllers/bank-controller";
import authenticateSetuToken from "../../middlewares/setu-token-middleware";
import authenticateToken from "../../middlewares/jwt-authentication-middleware";

const bankRouter = express.Router();

bankRouter.use(authenticateSetuToken);
bankRouter
  .route("/consent/create/:mobileNo")
  .get(authenticateToken, createSetuConsent);
// bankRouter.route("/consent/:id").get(authenticateToken, fetchTransactions);
bankRouter.route("/webhook").post(setuNotifications);

export default bankRouter;
