"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    user_id: { type: String, required: true },
    message: { type: String, required: true },
    title: { type: String, required: true },
    status: {
        type: String,
        enum: ["PENDING", "SENT", "FAILED"],
        default: "PENDING",
    },
    is_read: { type: Boolean, default: false },
    is_server_notification: { type: Boolean, default: false },
    future_payload: { type: String },
});
exports.Notification = (0, mongoose_1.model)("notifications", notificationSchema);
