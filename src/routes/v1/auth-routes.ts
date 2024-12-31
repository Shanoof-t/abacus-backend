import express from "express";
import {
  signIn,
  signUp,
  verifyOTP,
  retryOTP,
} from "../../controllers/auth-controller";
import validator from "../../middlewares/validator-middleware";
import schema from "../../schema/auth-schema";

const authRouter = express.Router();

authRouter.post("/sign-up", validator(schema.signUp), signUp);
authRouter.post("/sign-in", validator(schema.signIn), signIn);
authRouter.post("/verify-otp", validator(schema.verifyOTP), verifyOTP);
authRouter.post("/retry-otp", validator(schema.retryOTP), retryOTP);

export default authRouter;
