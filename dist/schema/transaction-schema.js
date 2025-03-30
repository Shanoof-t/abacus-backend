"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const add = zod_1.z.object({
    account_name: zod_1.z.string().min(1, { message: "Account name is required" }),
    category_name: zod_1.z.string().min(1, { message: "Category name is required" }),
    transaction_date: zod_1.z.string({
        message: "Invalid transaction date.",
    }),
    transaction_payee: zod_1.z.string().min(1, { message: "Payee name is required" }),
    transaction_amount: zod_1.z.string({ message: "The amount is required." }),
    transaction_note: zod_1.z.string().optional(),
    is_recurring: zod_1.z.boolean().optional(),
    recurring_frequency: zod_1.z
        .enum(["daily", "weekly", "monthly", "yearly"])
        .optional(),
    transaction_type: zod_1.z
        .string()
        .min(1, { message: "Transaction type is required" }),
});
const schema = {
    add,
};
exports.default = schema;
