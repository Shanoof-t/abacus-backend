"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const signUp = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const signIn = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const verifyOTP = zod_1.z.object({
    userId: zod_1.z.string(),
    otp: zod_1.z.string(),
});
const resendOTP = zod_1.z.object({
    userId: zod_1.z.string(),
});
const schema = {
    signUp,
    signIn,
    verifyOTP,
    resendOTP,
};
exports.default = schema;
