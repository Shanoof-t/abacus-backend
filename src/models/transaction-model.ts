import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user_id: { type: String, required: [true, "userId is required."] },
  transaction_date: { type: Date, required: true },
  account_name: { type: String, required: true },
  category_name: { type: String, required: true },
  transaction_amount: { type: Number, required: true },
  transaction_type: {
    type: String,
    required: [true, "transaction must be selected income or expense"],
    enum: ["income", "expense"],
  },
  transaction_payee: { type: String, required: [true, "payeee is required"] },
  transaction_note: { type: String },
  is_recurring: { type: Boolean },
  recurring: {
    recurring_frequency: { type: String, enum: ["daily", "weekly", "monthly", "yearly"] },
    next_date: { type: Date },
  },
  is_estimated: { type: Boolean, required: true, default: false },
});

export const Transaction = mongoose.model("transactions", transactionSchema);
