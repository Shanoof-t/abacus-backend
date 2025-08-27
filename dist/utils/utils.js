"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBudgetProgress = void 0;
const calculateBudgetProgress = ({ budgetLimit, totalSpentAmount, }) => {
    return Math.round(Math.min((totalSpentAmount / budgetLimit) * 100, 100));
};
exports.calculateBudgetProgress = calculateBudgetProgress;
