import mongoose from "mongoose";

const signUpSchema = new mongoose.Schema({
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: { type: String },
  user_name: { type: String },
  isVerified: {
    type: Boolean,
    required: [true, "Verification is required"],
    default: false,
  },
  picture: { type: String },
  isGoogle: { type: Boolean, default: false },
  googleId: { type: String, default: Date.now() + Math.random() },
});

export const UserModel = mongoose.model("user", signUpSchema);
