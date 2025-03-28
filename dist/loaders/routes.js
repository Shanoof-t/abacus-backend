"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_routes_1 = __importDefault(require("../routes/v1/auth-routes"));
const transaction_routes_1 = __importDefault(require("../routes/v1/transaction-routes"));
exports.default = ({ app }) => {
    app.use("/api/v1/auth", auth_routes_1.default);
    app.use("/api/v1/transaction", transaction_routes_1.default);
};
