import mongoose, { Schema, Types } from "mongoose";

const accountSchema = new Schema({
  user_id: { type: Types.ObjectId, required: [true, "user id is required."] },
  account_name: {
    type: String,
    required: [true, "account name is required."],
    unique: true,
  },
  account_balance: { type: Number, default: 0 },
});

export const Account = mongoose.model("account", accountSchema);
