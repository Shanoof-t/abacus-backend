"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("../../controllers/transaction-controller");
const validator_middleware_1 = __importDefault(require("../../middlewares/validator-middleware"));
const transaction_schema_1 = __importDefault(require("../../schema/transaction-schema"));
const jwt_authentication_middleware_1 = __importDefault(require("../../middlewares/jwt-authentication-middleware"));
const transactionRoute = express_1.default.Router();
transactionRoute.use(jwt_authentication_middleware_1.default);
transactionRoute.post("/", (0, validator_middleware_1.default)(transaction_schema_1.default.add), transaction_controller_1.addTransaction);
exports.default = transactionRoute;
