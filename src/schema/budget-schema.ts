import { z } from "zod";

const add = z.object({
  budget_name: z.string().min(1, "Budget name is required"),
  account_name: z.string().min(1, "Account name is required"),
  category_name: z.string().min(1, "Category name is required"),
  amount_limit: z.string().min(1, "Amount limit must be at least 1"),
  budget_start_date: z.string({ message: "Budget start date is required" }),
  budget_end_date: z.string({ message: "Budget end date is required" }),
  notification_status: z.boolean(),
  budget_note: z.string().optional(),
  alert_threshold: z
    .number()
    .min(0)
    .max(100, "Alert threshold must be between 0 and 100")
    .optional(),
});

const schema = {
  add,
};

export default schema;
