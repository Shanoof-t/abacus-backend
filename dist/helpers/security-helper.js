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
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.default = {
    hashPassword: (_a) => __awaiter(void 0, [_a], void 0, function* ({ password }) {
        return yield bcrypt_1.default.hash(password, 10);
    }),
    hashOTP: (_a) => __awaiter(void 0, [_a], void 0, function* ({ otp }) {
        return yield bcrypt_1.default.hash(otp, 10);
    }),
    VerifyPassword: (_a) => __awaiter(void 0, [_a], void 0, function* ({ password, existingPassword }) {
        return yield bcrypt_1.default.compare(password, existingPassword);
    }),
    verifyOTP: (_a) => __awaiter(void 0, [_a], void 0, function* ({ otp, hashedOTP }) {
        return yield bcrypt_1.default.compare(otp, hashedOTP);
    }),
};
