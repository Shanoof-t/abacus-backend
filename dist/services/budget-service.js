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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBudgetByCategoryName = exports.updateBudgetByName = exports.deleteBudgetByName = exports.fetchBudgetById = exports.fetchAllBudgets = exports.createBudget = void 0;
const budget_model_1 = require("../models/budget-model");
const transaction_model_1 = require("../models/transaction-model");
const Custom_error_1 = __importDefault(require("../utils/Custom-error"));
const budget_helper_1 = __importDefault(require("../helpers/budget-helper"));
const createBudget = (body, user) => __awaiter(void 0, void 0, void 0, function* () {
    const exisingBudget = yield budget_helper_1.default.findOneBudgetWithCategory({
        user_id: user === null || user === void 0 ? void 0 : user.sub,
        category_name: body.category_name,
    });
    if (exisingBudget)
        throw new Custom_error_1.default("This category with a budget is already existing", 400);
    const budgetLimit = body.amount_limit;
    const transactions = yield transaction_model_1.Transaction.find({
        user_id: user === null || user === void 0 ? void 0 : user.sub,
        category_name: body.category_name,
        transaction_type: "expense",
    });
    const totalSpentAmount = transactions.reduce((acc, value) => acc + value.transaction_amount, 0);
    const total_spent = Math.abs(totalSpentAmount);
    const progress = Math.max((total_spent / Number(budgetLimit)) * 100, 100);
    const budget = yield budget_model_1.Budget.create({
        user_id: user === null || user === void 0 ? void 0 : user.sub,
        budget_name: body.budget_name,
        budget_start_date: new Date(body.budget_start_date),
        budget_end_date: new Date(body.budget_end_date),
        category_name: body.category_name,
        amount_limit: Number(body.amount_limit),
        budget_note: body.budget_note,
        notification_status: body.notification_status,
        alert_threshold: body.alert_threshold,
        total_spent,
        progress: Math.round(Math.min(Math.max(progress, 100), 0)),
    });
    return budget;
});
exports.createBudget = createBudget;
const fetchAllBudgets = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const budgets = yield budget_model_1.Budget.find({ user_id: user === null || user === void 0 ? void 0 : user.sub });
    return budgets;
});
exports.fetchAllBudgets = fetchAllBudgets;
const fetchBudgetById = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, id }) {
    const budget = yield budget_model_1.Budget.findOne({
        _id: id,
    });
    if (!budget)
        throw new Custom_error_1.default("Can't find budget with this id", 400);
    return budget;
});
exports.fetchBudgetById = fetchBudgetById;
const deleteBudgetByName = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, id, }) {
    yield budget_model_1.Budget.deleteOne({ _id: id });
});
exports.deleteBudgetByName = deleteBudgetByName;
const updateBudgetByName = (_a) => __awaiter(void 0, [_a], void 0, function* ({ body, user, id, }) {
    const currentBudget = yield budget_model_1.Budget.findById(id);
    if ((currentBudget === null || currentBudget === void 0 ? void 0 : currentBudget.category_name) !== body.category_name) {
        const exisingBudget = yield budget_helper_1.default.findOneBudgetWithCategory({
            user_id: user === null || user === void 0 ? void 0 : user.sub,
            category_name: body.category_name,
        });
        if (exisingBudget)
            throw new Custom_error_1.default("This category with a budget is already existing", 400);
    }
    const budgetLimit = body.amount_limit;
    const transactions = yield transaction_model_1.Transaction.find({
        user_id: user === null || user === void 0 ? void 0 : user.sub,
        category_name: body.category_name,
        transaction_type: "expense",
    });
    const totalSpentAmount = transactions.reduce((acc, value) => acc + value.transaction_amount, 0);
    const total_spent = Math.abs(totalSpentAmount);
    const progress = Math.min((total_spent / Number(budgetLimit)) * 100, 100);
    const updatedData = {
        budget_name: body.budget_name,
        category_name: body.category_name,
        amount_limit: Number(body.amount_limit),
        budget_start_date: new Date(body.budget_start_date),
        budget_end_date: new Date(body.budget_end_date),
        budget_note: body.budget_note,
        total_spent,
        progress: Math.round(Math.max(progress, 100)),
    };
    yield budget_model_1.Budget.updateOne({ user_id: user === null || user === void 0 ? void 0 : user.sub, _id: id }, updatedData);
    return yield budget_model_1.Budget.findById(id);
});
exports.updateBudgetByName = updateBudgetByName;
const fetchBudgetByCategoryName = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, category, }) {
    const budget = yield budget_helper_1.default.findOneBudgetWithCategory({
        user_id: user === null || user === void 0 ? void 0 : user.sub,
        category_name: category,
    });
    return budget;
});
exports.fetchBudgetByCategoryName = fetchBudgetByCategoryName;
