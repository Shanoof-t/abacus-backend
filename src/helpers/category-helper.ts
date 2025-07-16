import { z } from "zod";
import schema from "../schema/transaction-schema";
import { User } from "../types";
import categoryRepository from "../repositories/category-repository";

type createCategories = {
  transactions: z.infer<typeof schema.add>[];
  user: User | undefined;
  isBankCategory?: boolean;
};

export default {
  createCategories: async ({
    transactions,
    user,
    isBankCategory = false,
  }: createCategories) => {
    const user_id = user?.sub;

    for (const transaction of transactions) {
      const category = transaction.category_name.replace(/\W/g, "");

      const existingCategory = await categoryRepository.findOneByName({
        category_name: category,
        user_id,
      });

      if (!existingCategory) {
        await categoryRepository.create({
          category_name: category,
          is_bank_category: isBankCategory,
          user_id,
        });
      }
    }
  },
  updateCategories: async ({ transactions, user }: createCategories) => {},
};
