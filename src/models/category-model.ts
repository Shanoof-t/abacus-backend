import mongoose, { Schema, Types } from "mongoose";

const categorySchema = new Schema({
  user_id: { type: Types.ObjectId, required: [true, "user id is required."] },
  category_name: {
    type: String,
    required: [true, "account name is required."],
    unique: true,
  },
  category_amount: {
    type: Number,
    required: [true, "amount is required."],
    default: 0,
  },
});

export const Category = mongoose.model("category", categorySchema);
