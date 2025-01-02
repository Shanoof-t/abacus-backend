"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../../controllers/auth-controller");
const validator_middleware_1 = __importDefault(require("../../middlewares/validator-middleware"));
const auth_schema_1 = __importDefault(require("../../schema/auth-schema"));
const authRouter = express_1.default.Router();
authRouter.post("/sign-up", (0, validator_middleware_1.default)(auth_schema_1.default.signUp), auth_controller_1.signUp);
authRouter.post("/sign-in", (0, validator_middleware_1.default)(auth_schema_1.default.signIn), auth_controller_1.signIn);
authRouter.post("/verify-otp", (0, validator_middleware_1.default)(auth_schema_1.default.verifyOTP), auth_controller_1.verifyOTP);
authRouter.post("/resend-otp", (0, validator_middleware_1.default)(auth_schema_1.default.resendOTP), auth_controller_1.resendOTP);
authRouter.get("/google-auth", auth_controller_1.googleOAuth);
authRouter.post("/oauth2-callback", auth_controller_1.googleOAuthcallback);
exports.default = authRouter;
