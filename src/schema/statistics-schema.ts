import { z } from "zod";

const financialSummary = z.object({
  from: z.date({ message: "from date is required" }),
  to: z.date({ message: "to date is required" }),
});

export const schema = {
  financialSummary,
};
