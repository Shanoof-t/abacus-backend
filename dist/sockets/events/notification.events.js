"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
function sendRecurringNotification({ userId, notification, }) {
    const io = __1.default.getIO();
    io.to(userId).emit("notification:send", notification);
}
exports.default = {
    sendRecurringNotification,
};
