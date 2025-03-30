"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const zod_1 = require("zod");
const financialSummary = zod_1.z.object({
    from: zod_1.z.string({ message: "from date is required" }),
    to: zod_1.z.string({ message: "to date is required" }),
    account: zod_1.z.string().optional(),
});
exports.schema = {
    financialSummary,
};
