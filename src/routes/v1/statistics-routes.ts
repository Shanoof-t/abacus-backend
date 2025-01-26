import express from "express";
import {
  financialSummary,
  serialFinincialSummary,
} from "../../controllers/statistics-controller";
import authenticateToken from "../../middlewares/jwt-authentication-middleware";
import { schema } from "../../schema/statistics-schema";
import validatorMiddleware from "../../middlewares/validator-middleware";

const statisticsRouter = express.Router();

statisticsRouter.use(authenticateToken);
statisticsRouter
  .route("/financial-summary")
  .post(validatorMiddleware(schema.financialSummary), financialSummary);
statisticsRouter
  .route("/financial-history")
  .post(validatorMiddleware(schema.financialSummary), serialFinincialSummary);
export default statisticsRouter;
