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
exports.default = authRouter;
