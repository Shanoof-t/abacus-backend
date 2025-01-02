"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const transactionSchema = new mongoose_1.default.Schema({
    user_id: { type: String, required: [true, "userId is required."] },
    date: { type: Date, required: true },
    account: { type: String, required: true },
    category: { type: String, required: true },
    payee: { type: String, required: true },
    amount: { type: Number, required: true },
    transaction_type: {
        type: String,
        required: [true, "transaction must be selected income or expense"],
    },
    notes: { type: String },
    is_recurring: { type: Boolean },
    recurring: {
        frequency: { type: String, enum: ["daily", "weekly", "monthly", "yearly"] },
        next_date: { type: Date },
    },
    is_estimated: { type: Boolean, required: true, default: false },
});
exports.Transaction = mongoose_1.default.model("transactions", transactionSchema);
