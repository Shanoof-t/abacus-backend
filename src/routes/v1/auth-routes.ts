import express from "express";
import { signIn, signUp } from "../../controllers/auth-controller";
import validator from "../../middlewares/validator-middleware";
import schema from "../../schema/auth-schema";

const authRouter = express.Router();

authRouter.post("/sign-up", validator(schema.signUp), signUp);
authRouter.post("/sign-in", validator(schema.signIn), signIn);

export default authRouter;
