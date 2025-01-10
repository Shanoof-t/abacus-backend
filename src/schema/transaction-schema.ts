import { z } from "zod";

const add = z.object({
  account_name: z.string().min(1, { message: "Account name is required" }),
  category_name: z.string().min(1, { message: "Category name is required" }),
  transaction_date: z.string({
    message: "Invalid transaction date.",
  }),
  transaction_payee: z.string().min(1, { message: "Payee name is required" }),
  transaction_amount: z.string({ message: "The amount is required." }),
  transaction_note: z.string().optional(),
});

const schema = {
  add,
};

export default schema;
