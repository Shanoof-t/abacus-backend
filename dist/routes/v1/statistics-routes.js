"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const statistics_controller_1 = require("../../controllers/statistics-controller");
const jwt_authentication_middleware_1 = __importDefault(require("../../middlewares/jwt-authentication-middleware"));
const statistics_schema_1 = require("../../schema/statistics-schema");
const validator_middleware_1 = __importDefault(require("../../middlewares/validator-middleware"));
const statisticsRouter = express_1.default.Router();
statisticsRouter.use(jwt_authentication_middleware_1.default);
statisticsRouter
    .route("/financial-summary")
    .post((0, validator_middleware_1.default)(statistics_schema_1.schema.financialSummary), statistics_controller_1.financialSummary);
statisticsRouter
    .route("/financial-history")
    .post((0, validator_middleware_1.default)(statistics_schema_1.schema.financialSummary), statistics_controller_1.serialFinincialSummary);
exports.default = statisticsRouter;
