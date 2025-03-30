"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requiredEnvVar = [
    "MONGO_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "MAIL_EMAIL",
    "MAIL_PASS",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REDIRECT_URL",
    "SESSION_SECRET",
    "SETU_BASE_URL",
    "SETU_PRODUCT_ID",
    "SETU_CLIENT_ID",
    "SETU_CLIENT_SECRET",
];
requiredEnvVar.forEach((key) => {
    if (!process.env[key])
        throw new Error(`Enviorment variable ${key} is missing`);
});
const env = {
    MONGO_URL: process.env.MONGO_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    MAIL_EMAIL: process.env.MAIL_EMAIL,
    MAIL_PASS: process.env.MAIL_PASS,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    SETU_BASE_URL: process.env.SETU_BASE_URL,
    SETU_PRODUCT_ID: process.env.SETU_PRODUCT_ID,
    SETU_CLIENT_ID: process.env.SETU_CLIENT_ID,
    SETU_CLIENT_SECRET: process.env.SETU_CLIENT_SECRET,
};
exports.default = env;
