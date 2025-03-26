import express from "express";
import { createSetuConsent, getConsent } from "../../controllers/bank-controller";

const bankRouter = express.Router();

bankRouter.route("/consent/create").get(createSetuConsent);
bankRouter.route("/consent/:id").get(getConsent);

export default bankRouter;
