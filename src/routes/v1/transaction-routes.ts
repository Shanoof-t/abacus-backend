import express from "express";
import { addTransaction } from "../../controllers/transaction-controller";
import validator from "../../middlewares/validator-middleware";
import schema from "../../schema/transaction-schema";
import authenticateToken from "../../middlewares/jwt-authentication-middleware";

const transactionRoute = express.Router();

transactionRoute.use(authenticateToken)

transactionRoute.post("/", validator(schema.add), addTransaction);

export default transactionRoute;
