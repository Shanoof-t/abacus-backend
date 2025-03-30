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
exports.fetchFinancialHistory = exports.createSummary = void 0;
const statistics_helper_1 = __importDefault(require("../helpers/statistics-helper"));
const date_fns_1 = require("date-fns");
const createSummary = (user, body) => __awaiter(void 0, void 0, void 0, function* () {
    const income = yield statistics_helper_1.default.getIncome(body, user);
    const expense = yield statistics_helper_1.default.getExpense(body, user);
    const remaining = income - expense;
    const currentMonth = body.from;
    const previouseMonth = (0, date_fns_1.subMonths)(currentMonth, 1).toISOString();
    const accountName = body.account;
    const pastMonthIncome = yield statistics_helper_1.default.getPastMonthIncome({
        currentMonth,
        previouseMonth,
        accountName,
        user,
    });
    const pastMonthExpense = yield statistics_helper_1.default.getPastMonthExpense({
        currentMonth,
        previouseMonth,
        accountName,
        user,
    });
    const pastMonthRemaining = pastMonthIncome - pastMonthExpense;
    const pastMonthIncomePercentage = ((pastMonthIncome - income) / income) * -100;
    const pastMonthExpensePercentage = ((pastMonthExpense - expense) / expense) * -100;
    const pastMonthRemainingPercentage = ((Math.abs(pastMonthRemaining) - Math.abs(remaining)) /
        Math.abs(remaining)) *
        -100;
    const clamp = (value) => Math.min(Math.max(value, 100), 100);
    return {
        income,
        expense,
        remaining,
        pastMonthIncomePercentage: Math.round(clamp(pastMonthIncomePercentage)),
        pastMonthExpensePercentage: Math.round(clamp(pastMonthExpensePercentage)),
        pastMonthRemainingPercentage: Math.round(clamp(pastMonthRemainingPercentage)),
    };
});
exports.createSummary = createSummary;
const fetchFinancialHistory = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, body, }) {
    const transactionSummary = yield statistics_helper_1.default.getTransactionSummary({
        user,
        body,
    });
    const formatedTransactionSummary = transactionSummary.map((month) => {
        return Object.assign(Object.assign({}, month), { date: month._id, expense: Math.abs(month.expense) });
    });
    const categories = yield statistics_helper_1.default.getCategory({ user });
    const data = {
        transaction: formatedTransactionSummary,
        categories,
    };
    return data;
});
exports.fetchFinancialHistory = fetchFinancialHistory;
