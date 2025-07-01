import { z } from "zod";

const financialSummary = z.object({
  from: z.string({ message: "from date is required" }),
  to: z.string({ message: "to date is required" }),
  account: z.string().optional(),
});

export const schema = {
  financialSummary,
};
