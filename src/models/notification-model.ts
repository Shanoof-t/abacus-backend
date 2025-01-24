import { model, Schema } from "mongoose";

const notificationSchema = new Schema({
  user_id: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ["PENDING", "SENT", "FAILED"],
    default: "PENDING",
  },
  is_read: { type: Boolean, default: false },
  is_server_notification: { type: Boolean, default: false },
  future_payload: { type: String },
});

export const Notification = model("notifications", notificationSchema);
