import express from "express";
import {
  signIn,
  signUp,
  verifyOTP,
  resendOTP,
  googleOAuth,
  googleOAuthcallback,
  logoutUser,
} from "../../controllers/auth-controller";
import validator from "../../middlewares/validator-middleware";
import schema from "../../schema/auth-schema";

const authRouter = express.Router();

authRouter.post("/sign-up", validator(schema.signUp), signUp);
authRouter.post("/sign-in", validator(schema.signIn), signIn);
authRouter.post("/logout",logoutUser)

authRouter.post("/verify-otp", validator(schema.verifyOTP), verifyOTP);
authRouter.post("/resend-otp", validator(schema.resendOTP), resendOTP);

authRouter.get("/google-auth", googleOAuth);
authRouter.post("/oauth2-callback", googleOAuthcallback);

export default authRouter;
