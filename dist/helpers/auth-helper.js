"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const otp_generator_1 = __importDefault(require("otp-generator"));
const otp_verification_model_1 = require("../models/otp-verification-model");
exports.default = {
    generateOTP: () => {
        return otp_generator_1.default.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            digits: true,
            specialChars: false,
        });
    },
    createOneTimePassword: (_a) => __awaiter(void 0, [_a], void 0, function* ({ _id, hashedOTP }) {
        return yield otp_verification_model_1.OneTimePassword.create({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 60 * 1000,
        });
    }),
    getUserDataFromGoogle: (access_token) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
        return yield response.json();
    }),
};
