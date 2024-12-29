"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const signUpSchema = new mongoose_1.default.Schema({
    email: { type: String, required: [true, "Email is required"] },
    password: { type: String, required: [true, "Password is required"] },
});
exports.User = mongoose_1.default.model("user", signUpSchema);
