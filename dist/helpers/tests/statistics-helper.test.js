"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const statistics_helper_1 = __importDefault(require("../statistics-helper"));
(0, node_test_1.describe)("createPastMonthIncomePercentage", {}, () => {
    (0, node_test_1.it)("should return 0%", () => {
        const result = statistics_helper_1.default.createPastMonthIncomePercentage({
            income: 0,
            pastMonthIncome: 1000,
        });
        node_assert_1.default.strictEqual(result, 100);
    });
    (0, node_test_1.it)("should cap at 100%", () => {
        const result = statistics_helper_1.default.createPastMonthIncomePercentage({
            income: 1000,
            pastMonthIncome: 0,
        });
        node_assert_1.default.strictEqual(result, 100);
    });
});
