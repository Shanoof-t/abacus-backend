import express from "express";
import { addAccount } from "../../controllers/account-controller";
import authenticateToken from "../../middlewares/jwt-authentication-middleware";

const accountRouter = express.Router();

accountRouter.use(authenticateToken);

accountRouter.post("/", addAccount);

export default accountRouter;
