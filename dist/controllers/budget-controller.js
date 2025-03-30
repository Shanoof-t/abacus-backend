"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBudgetByCategory = exports.updateBudget = exports.deleteBudget = exports.getBudget = exports.getAllBudgets = exports.addBudget = void 0;
const budget_service_1 = require("../services/budget-service");
const error_handlers_1 = require("../utils/error-handlers");
exports.addBudget = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, user } = req;
    const budget = yield (0, budget_service_1.createBudget)(body, user);
    res
        .status(200)
        .json({
        status: "success",
        message: "Successfully created budget.",
        data: budget,
    });
}));
exports.getAllBudgets = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const budgets = yield (0, budget_service_1.fetchAllBudgets)(user);
    res.status(200).json({
        status: "success",
        message: "Successfully fetched budgets",
        data: budgets,
    });
}));
exports.getBudget = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const { id } = req.params;
    const budget = yield (0, budget_service_1.fetchBudgetById)({ user, id });
    res
        .status(200)
        .json({ status: "success", message: "successfully fetched", data: budget });
}));
exports.deleteBudget = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const { id } = req.params;
    yield (0, budget_service_1.deleteBudgetByName)({ user, id });
    res
        .status(200)
        .json({ status: "success", message: "Successfully deleted budget" });
}));
exports.updateBudget = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, body } = req;
    const { id } = req.params;
    console.log("body in controller", body);
    const existingBudget = yield (0, budget_service_1.updateBudgetByName)({ body, user, id });
    res.status(200).json({
        status: "success",
        message: "Budget updated successfully",
        data: existingBudget,
    });
}));
exports.getBudgetByCategory = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const { category } = req.params;
    const budget = yield (0, budget_service_1.fetchBudgetByCategoryName)({ user, category });
    res.status(200).json({
        status: "success",
        message: "Successfully fethched budget",
        data: budget,
    });
}));
