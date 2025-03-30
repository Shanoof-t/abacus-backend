"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const add = zod_1.z.object({
    budget_name: zod_1.z.string().min(1, "Budget name is required"),
    category_name: zod_1.z.string().min(1, "Category name is required"),
    amount_limit: zod_1.z.string().min(1, "Amount limit must be at least 1"),
    budget_start_date: zod_1.z.string({ message: "Budget start date is required" }),
    budget_end_date: zod_1.z.string({ message: "Budget end date is required" }),
    notification_status: zod_1.z.boolean(),
    budget_note: zod_1.z.string().optional(),
    alert_threshold: zod_1.z
        .number()
        .min(0)
        .max(100, "Alert threshold must be between 0 and 100")
        .optional(),
});
const schema = {
    add,
};
exports.default = schema;
