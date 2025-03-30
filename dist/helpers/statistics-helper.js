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
const transaction_model_1 = require("../models/transaction-model");
const category_model_1 = require("../models/category-model");
exports.default = {
    getIncome: (body, user) => __awaiter(void 0, void 0, void 0, function* () {
        const matchStage = {
            user_id: user === null || user === void 0 ? void 0 : user.sub,
            transaction_date: {
                $gte: new Date(body.from),
                $lte: new Date(body.to),
            },
            transaction_type: "income",
        };
        if (body.account) {
            matchStage.account_name = body.account;
        }
        const income = yield transaction_model_1.Transaction.aggregate([
            {
                $match: matchStage,
            },
            {
                $group: {
                    _id: "$transaction_type",
                    income: { $sum: "$transaction_amount" },
                },
            },
        ]);
        if (income) {
            return income[0] && income[0].income;
        }
        else {
            return 0;
        }
    }),
    getExpense: (body, user) => __awaiter(void 0, void 0, void 0, function* () {
        const matchStage = {
            user_id: user === null || user === void 0 ? void 0 : user.sub,
            transaction_date: {
                $gte: new Date(body.from),
                $lte: new Date(body.to),
            },
            transaction_type: "expense",
        };
        if (body.account) {
            matchStage.account_name = body.account;
        }
        const expense = yield transaction_model_1.Transaction.aggregate([
            {
                $match: matchStage,
            },
            {
                $group: {
                    _id: "$transaction_type",
                    expense: { $sum: "$transaction_amount" },
                },
            },
        ]);
        if (expense) {
            return expense[0] && Math.abs(expense[0].expense);
        }
        else {
            return 0;
        }
    }),
    getPastMonthIncome: (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, previouseMonth, currentMonth, accountName, }) {
        const matchStage = {
            user_id: user === null || user === void 0 ? void 0 : user.sub,
            transaction_date: {
                $gte: new Date(previouseMonth),
                $lte: new Date(currentMonth),
            },
            transaction_type: "income",
        };
        if (accountName) {
            matchStage.account_name = accountName;
        }
        const pastMonthIncome = yield transaction_model_1.Transaction.aggregate([
            {
                $match: matchStage,
            },
            {
                $group: {
                    _id: "$transaction_type",
                    income: { $sum: "$transaction_amount" },
                },
            },
        ]);
        if (pastMonthIncome.length > 0) {
            return pastMonthIncome[0] && pastMonthIncome[0].income;
        }
        else {
            return 0;
        }
    }),
    getPastMonthExpense: (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, previouseMonth, currentMonth, accountName, }) {
        const matchStage = {
            user_id: user === null || user === void 0 ? void 0 : user.sub,
            transaction_date: {
                $gte: new Date(previouseMonth),
                $lte: new Date(currentMonth),
            },
            transaction_type: "expense",
        };
        if (accountName) {
            matchStage.account_name = accountName;
        }
        const pastMonthExpense = yield transaction_model_1.Transaction.aggregate([
            {
                $match: matchStage,
            },
            {
                $group: {
                    _id: "$transaction_type",
                    expense: { $sum: "$transaction_amount" },
                },
            },
        ]);
        if (pastMonthExpense.length > 0) {
            return pastMonthExpense[0] && Math.abs(pastMonthExpense[0].expense);
        }
        else {
            return 0;
        }
    }),
    getTransactionSummary: (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, body, }) {
        const matchStage = {
            user_id: user === null || user === void 0 ? void 0 : user.sub,
            transaction_date: {
                $gte: new Date(body.from),
                $lte: new Date(body.to),
            },
        };
        if (body.account) {
            matchStage.account_name = body.account;
        }
        return yield transaction_model_1.Transaction.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: "$transaction_date",
                    income: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$transaction_type", "income"] },
                                then: "$transaction_amount",
                                else: 0,
                            },
                        },
                    },
                    expense: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$transaction_type", "expense"] },
                                then: "$transaction_amount",
                                else: 0,
                            },
                        },
                    },
                },
            },
        ]);
    }),
    getCategory: (_a) => __awaiter(void 0, [_a], void 0, function* ({ user }) {
        return yield category_model_1.Category.find({ user_id: user === null || user === void 0 ? void 0 : user.sub });
    }),
};
