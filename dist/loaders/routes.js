"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_routes_1 = __importDefault(require("../routes/v1/account-routes"));
const auth_routes_1 = __importDefault(require("../routes/v1/auth-routes"));
const category_routes_1 = __importDefault(require("../routes/v1/category-routes"));
const transaction_routes_1 = __importDefault(require("../routes/v1/transaction-routes"));
const budget_routes_1 = __importDefault(require("../routes/v1/budget-routes"));
const statistics_routes_1 = __importDefault(require("../routes/v1/statistics-routes"));
const notification_routes_1 = __importDefault(require("../routes/v1/notification-routes"));
const bank_router_1 = __importDefault(require("../routes/v1/bank-router"));
exports.default = ({ app }) => {
    app.use("/api/v1/auth", auth_routes_1.default);
    app.use("/api/v1/transaction", transaction_routes_1.default);
    app.use("/api/v1/account", account_routes_1.default);
    app.use("/api/v1/category", category_routes_1.default);
    app.use("/api/v1/budget", budget_routes_1.default);
    app.use("/api/v1/statistics", statistics_routes_1.default);
    app.use("/api/v1/notifications", notification_routes_1.default);
    app.use("/api/v1/bank", bank_router_1.default);
};
