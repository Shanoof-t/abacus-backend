import mongoose from "mongoose";

const signUpSchema = new mongoose.Schema({
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

export const User = mongoose.model("user", signUpSchema);
