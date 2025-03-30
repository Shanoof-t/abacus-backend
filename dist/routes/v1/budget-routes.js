"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_authentication_middleware_1 = __importDefault(require("../../middlewares/jwt-authentication-middleware"));
const budget_controller_1 = require("../../controllers/budget-controller");
const validator_middleware_1 = __importDefault(require("../../middlewares/validator-middleware"));
const budget_schema_1 = __importDefault(require("../../schema/budget-schema"));
const budgetRouter = express_1.default.Router();
budgetRouter.use(jwt_authentication_middleware_1.default);
budgetRouter
    .route("/")
    .post((0, validator_middleware_1.default)(budget_schema_1.default.add), budget_controller_1.addBudget)
    .get(budget_controller_1.getAllBudgets);
budgetRouter.route("/category/:category").get(budget_controller_1.getBudgetByCategory);
budgetRouter
    .route("/:id")
    .get(budget_controller_1.getBudget)
    .delete(budget_controller_1.deleteBudget)
    .post(budget_controller_1.updateBudget);
// budgetRouter.post("/bulk-delete", accountBulkDelete);
exports.default = budgetRouter;
