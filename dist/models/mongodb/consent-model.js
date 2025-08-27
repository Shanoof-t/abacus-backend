"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const consentSchema = new mongoose_1.default.Schema({
    consent_id: { type: String, required: true },
    userDetails: {
        user_id: { type: String, required: true },
        user_email: { type: String, required: true },
    },
    connectedAccounts: { type: Array, default: [] },
    isApproved: {
        type: Boolean,
        required: true,
        default: false,
    },
});
// export const Consent = mongoose.model("consent", consentSchema);
