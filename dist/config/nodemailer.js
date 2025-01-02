"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailOption = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_variables_1 = __importDefault(require("./env_variables"));
exports.transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: env_variables_1.default.MAIL_EMAIL,
        pass: env_variables_1.default.MAIL_PASS,
    },
});
const mailOption = ({ email, otp }) => {
    return {
        from: env_variables_1.default.MAIL_EMAIL,
        to: email,
        subject: "Verify Your Email",
        html: `<p>Enter <strong>${otp}</strong> in the app to verify</p><p>This OTP expires in 1 minute.</p>`,
    };
};
exports.mailOption = mailOption;
