"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
function bankAccountConnectedEvent({ userId, data, }) {
    const io = __1.default.getIO();
    io.to(userId).emit("bank:connected", {
        message: "Successfully connected,transactions updated within one day",
        data,
    });
}
exports.default = {
    bankAccountConnectedEvent,
};
