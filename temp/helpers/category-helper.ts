import { z } from "zod";
import { Category } from "../models/category-model";
import schema from "../schema/transaction-schema";
import { User } from "../middlewares/jwt-authentication-middleware";

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

      const existingCategory = await Category.findOne({
        user_id,
        category_name: category,
      });

      if (!existingCategory) {
        await Category.create({
          user_id,
          category_name: category,
          isBankCategory,
        });
      }
    }
  },
  updateCategories: async ({ transactions, user }: createCategories) => {},
};
