"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const utils_1 = require("../utils/utils");
const node_assert_1 = __importDefault(require("node:assert"));
(0, node_test_1.describe)("calculateBudgetProgress", {}, () => {
    (0, node_test_1.it)("should return 0% when nothing is spent", () => {
        const progress = (0, utils_1.calculateBudgetProgress)({
            budgetLimit: 1000,
            totalSpentAmount: 0,
        });
        node_assert_1.default.strictEqual(progress, 0);
    });
    (0, node_test_1.it)("should calculate correct percentage", () => {
        const result = (0, utils_1.calculateBudgetProgress)({
            budgetLimit: 1000,
            totalSpentAmount: 250,
        });
        node_assert_1.default.strictEqual(result, 25);
    });
    (0, node_test_1.it)("should round properly", () => {
        const result = (0, utils_1.calculateBudgetProgress)({
            budgetLimit: 3,
            totalSpentAmount: 2,
        });
        node_assert_1.default.strictEqual(result, 67);
    });
    (0, node_test_1.it)("should cap at 100%", () => {
        const result = (0, utils_1.calculateBudgetProgress)({
            budgetLimit: 1000,
            totalSpentAmount: 1500,
        });
        node_assert_1.default.strictEqual(result, 100);
    });
});
