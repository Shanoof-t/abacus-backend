import express from "express";
import { signUp } from "../../controllers/auth-controller";
import validator from "../../middlewares/validator-middleware";
import schema from "../../schema/auth-schema";

const authRouter = express.Router();

authRouter.post("/sign-up", validator(schema.signUp), signUp);

export default authRouter;
