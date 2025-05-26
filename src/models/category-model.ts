import mongoose, { Schema, Types } from "mongoose";

const categorySchema = new Schema({
  user_id: { type: Types.ObjectId, required: [true, "user id is required."] },
  category_name: {
    type: String,
    required: [true, "category name is required."],
  },
  isBankCategory: { type: Boolean, default: false },
});

export const Category = mongoose.model("category", categorySchema);
