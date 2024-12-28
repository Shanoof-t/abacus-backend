import mongoose from "mongoose";

const signUpSchema = new mongoose.Schema({
  email: { type: String, required: [true, "Email is required"] },
  password: { type: String, required: [true, "Password is required"] },
});

export const User = mongoose.model("user", signUpSchema);
