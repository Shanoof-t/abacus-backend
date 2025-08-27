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
const budget_repository_1 = __importDefault(require("../repositories/budget-repository"));
exports.default = {
    findOneBudgetWithCategory: (_a) => __awaiter(void 0, [_a], void 0, function* ({ user_id, category_name, }) {
        return yield budget_repository_1.default.findOneByName({ category_name, user_id });
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
            const totalSpentAmount = totalSpent + transaction_amount;
            // mesure the progress percentage
            const progress = Math.round(Math.min((totalSpentAmount / Number(exisingBudget === null || exisingBudget === void 0 ? void 0 : exisingBudget.amount_limit)) * 100, 100));
            // finally update with budget
            yield budget_repository_1.default.updateProgress({
                category_name,
                progress,
                total_spent: totalSpentAmount,
                user_id,
            });
        });
    },
};
