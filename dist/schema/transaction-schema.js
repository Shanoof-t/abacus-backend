"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const add = zod_1.z.object({
    date: zod_1.z.string().nonempty("date is required."),
    account: zod_1.z.string().nonempty("account is required."),
    category: zod_1.z.string().nonempty("category is required."),
    payee: zod_1.z.string().nonempty("payee is required."),
    amount: zod_1.z.number({ required_error: "amount is required." }),
    notes: zod_1.z.string().optional(),
    is_recurring: zod_1.z.boolean().optional(),
    freequency: zod_1.z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
});
const schema = {
    add,
};
exports.default = schema;
