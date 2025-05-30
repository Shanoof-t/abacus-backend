"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Budget = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const budgetSchema = new mongoose_1.default.Schema({
    user_id: { type: String, required: [true, "userId is required."] },
    budget_name: {
        type: String,
        required: [true, "Budget name is required"],
    },
    category_name: {
        type: String,
        required: [true, "Category name is required"],
        unique: true,
    },
    amount_limit: {
        type: Number,
        required: [true, "Amount limit is required"],
    },
    budget_start_date: {
        type: Date,
        required: [true, "Budget start date is required"],
    },
    budget_end_date: {
        type: Date,
        required: [true, "Budget end date is required"],
    },
    notification_status: {
        type: Boolean,
        required: true,
    },
    budget_note: {
        type: String,
        default: null,
    },
    alert_threshold: {
        type: Number,
        min: [0, "Alert threshold must not be below 0"],
        max: [100, "Alert threshold must be between 0 and 100"],
        default: null,
    },
    total_spent: {
        type: Number,
        required: [true, "total spented amount is needed"],
        default: 0,
    },
    progress: {
        type: Number,
        required: [true, "progress is required."],
    },
});
exports.Budget = mongoose_1.default.model("budgets", budgetSchema);
