import { z } from "zod";

const add = z.object({
  date: z.string().nonempty("date is required."),
  account: z.string().nonempty("account is required."),
  category: z.string().nonempty("category is required."),
  payee: z.string().nonempty("payee is required."),
  amount: z.number({ required_error: "amount is required." }),
  notes: z.string().optional(),
  is_recurring: z.boolean().optional(),
  freequency: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
});

const schema = {
  add,
};

export default schema;
