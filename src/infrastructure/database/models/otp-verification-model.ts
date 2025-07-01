import mongoose, { Schema } from "mongoose";

const UserVerificaitonSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, "user id is required"],
  },
  otp: { type: String, requried: [true, "OTP is required"] },
  createdAt: { type: Date, requried: [true, "OTP created time is required"] },
  expiresAt: { type: Date, requried: [true, "OTP expires time is required"] },
});

export const OneTimePassword = mongoose.model(
  "otpVerification",
  UserVerificaitonSchema
);
