import express from "express";
import {
  createSetuConsent,
  setuNotifications,
} from "../../controllers/bank-controller";
import authenticateSetuToken from "../../middlewares/setu-token-middleware";
import authenticateToken from "../../middlewares/jwt-authentication-middleware";

const bankRouter = express.Router();

bankRouter.use(authenticateSetuToken);
bankRouter
  .route("/consent/create/:mobileNo")
  .get(authenticateToken, createSetuConsent);

bankRouter.route("/webhook").post(setuNotifications);

export default bankRouter;
