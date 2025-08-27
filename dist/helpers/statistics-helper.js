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
const transaction_repository_1 = __importDefault(require("../repositories/transaction-repository"));
exports.default = {
    getIncome: (body, user) => __awaiter(void 0, void 0, void 0, function* () {
        const matchData = {
            user_id: user.sub,
            fromDate: body.from,
            toDate: body.to,
            transaction_type: "income",
        };
        if (body.account) {
            matchData.account_name = body.account;
        }
        const income = yield transaction_repository_1.default.findIncome(matchData);
        if (income) {
            return income.income;
        }
        else {
            return 0;
        }
    }),
    getExpense: (body, user) => __awaiter(void 0, void 0, void 0, function* () {
        const matchData = {
            user_id: user.sub,
            fromDate: body.from,
            toDate: body.to,
            transaction_type: "expense",
        };
        if (body.account) {
            matchData.account_name = body.account;
        }
        const expense = yield transaction_repository_1.default.findExpense(matchData);
        if (expense) {
            return expense.expense;
        }
        else {
            return 0;
        }
    }),
    getPastMonthIncome: (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, previouseMonth, currentMonth, accountName, }) {
        const matchData = {
            user_id: user === null || user === void 0 ? void 0 : user.sub,
            currentMonth,
            previouseMonth,
            transaction_type: "income",
        };
        if (accountName) {
            matchData.account_name = accountName;
        }
        const pastMonthIncome = yield transaction_repository_1.default.findPreviousPeriodIncome(matchData);
        return pastMonthIncome ? pastMonthIncome.income : 0;
    }),
    getPastMonthExpense: (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, previouseMonth, currentMonth, accountName, }) {
        const matchData = {
            user_id: user === null || user === void 0 ? void 0 : user.sub,
            currentMonth,
            previouseMonth,
            transaction_type: "expense",
        };
        if (accountName) {
            matchData.account_name = accountName;
        }
        const pastMonthExpense = yield transaction_repository_1.default.findPreviousPeriodExpense(matchData);
        return pastMonthExpense ? pastMonthExpense.expense : 0;
    }),
    getTransactionSummary: (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, body, }) {
        const matchData = {
            user_id: user.sub,
            fromDate: body.from,
            toDate: body.to,
        };
        if (body.account) {
            matchData.account_name = body.account;
        }
        return yield transaction_repository_1.default.findTransactionSummary(matchData);
    }),
    getCategory: (_a) => __awaiter(void 0, [_a], void 0, function* ({ user }) {
        const transactions = yield transaction_repository_1.default.findByType({
            user_id: user.sub,
            transaction_type: "expense",
        });
        const categoriesMap = new Map();
        transactions.forEach(({ category_name, transaction_amount }, index) => {
            if (categoriesMap.has(category_name)) {
                const currentCategory = categoriesMap.get(category_name);
                const updatedCategory = Object.assign(Object.assign({}, currentCategory), { category_amount: currentCategory.category_amount + transaction_amount });
                categoriesMap.set(category_name, updatedCategory);
            }
            else {
                const obj = {
                    id: index + 1,
                    category_name,
                    category_amount: transaction_amount,
                };
                categoriesMap.set(category_name, obj);
            }
        });
        const categories = Array.from(categoriesMap.values());
        return categories;
    }),
};
