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
const budget_model_1 = require("../models/budget-model");
exports.default = {
    findOneBudgetWithCategory: (_a) => __awaiter(void 0, [_a], void 0, function* ({ user_id, category_name, }) {
        return yield budget_model_1.Budget.findOne({
            user_id,
            category_name,
        });
    }),
    updateBudgetAfterTransaction: function (_a) {
        return __awaiter(this, arguments, void 0, function* ({ user_id, category_name, transaction_amount, }) {
            // find the existing budget
            const exisingBudget = yield this.findOneBudgetWithCategory({
                user_id,
                category_name,
            });
            // total spent calculation
            const totalSpent = (exisingBudget === null || exisingBudget === void 0 ? void 0 : exisingBudget.total_spent) || 0;
            const totalSpentAmount = totalSpent + Number(transaction_amount);
            // mesure the progress percentage
            const progress = Math.min((totalSpentAmount / Number(exisingBudget === null || exisingBudget === void 0 ? void 0 : exisingBudget.amount_limit)) * 100, 100);
            // finally update with budget
            yield budget_model_1.Budget.updateOne({
                user_id,
                category_name,
            }, { $set: { total_spent: totalSpentAmount, progress } });
        });
    },
};
