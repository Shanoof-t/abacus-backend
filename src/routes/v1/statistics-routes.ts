import express from "express";
import { financialSummary } from "../../controllers/statistics-controller";
import authenticateToken from "../../middlewares/jwt-authentication-middleware";

const statisticsRouter = express.Router();

statisticsRouter.use(authenticateToken);
statisticsRouter.route("/financial-summary").post(financialSummary);
export default statisticsRouter;
