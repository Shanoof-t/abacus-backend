"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bank_controller_1 = require("../../controllers/bank-controller");
const setu_token_middleware_1 = __importDefault(require("../../middlewares/setu-token-middleware"));
const jwt_authentication_middleware_1 = __importDefault(require("../../middlewares/jwt-authentication-middleware"));
const bankRouter = express_1.default.Router();
bankRouter.route("/consent").get(jwt_authentication_middleware_1.default, bank_controller_1.getUserConsent);
bankRouter.use(setu_token_middleware_1.default);
bankRouter
    .route("/consent/create/:mobileNo")
    .get(jwt_authentication_middleware_1.default, bank_controller_1.createSetuConsent);
bankRouter
    .route("/consent/:consentId")
    .delete(jwt_authentication_middleware_1.default, bank_controller_1.disConnectBankAccount);
bankRouter.route("/webhook").post(bank_controller_1.setuNotifications);
exports.default = bankRouter;
