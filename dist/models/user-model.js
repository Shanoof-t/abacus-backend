"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const signUpSchema = new mongoose_1.default.Schema({
    email: { type: String, required: [true, "Email is required"], unique: true },
    password: { type: String },
    isVerified: {
        type: Boolean,
        required: [true, "Verification is required"],
        default: false,
    },
    picture: { type: String },
    isGoogle: { type: Boolean, default: false },
    googleId: { type: String, unique: true },
});
exports.User = mongoose_1.default.model("user", signUpSchema);
