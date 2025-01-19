import { z } from "zod";
import { Category } from "../models/category-model";
import schema from "../schema/transaction-schema";
import { User } from "../middlewares/jwt-authentication-middleware";

type createCategories = {
  transactions: z.infer<typeof schema.add>[];
  user: User | undefined;
};

export default {
  createCategories: async ({ transactions, user }: createCategories) => {
    const user_id = user?.sub;

    for (const transaction of transactions) {
      const category = transaction.category_name.replace(/\W/g, "");
      const amount = Math.abs(parseFloat(transaction.transaction_amount));

      const existingCategory = await Category.findOne({
        category_name: category,
      });

      if (existingCategory) {
        await Category.updateOne(
          { category_name: category },
          {
            $inc: {
              category_amount: amount,
            },
          }
        );
      }
      if (!existingCategory) {
        await Category.create({
          user_id,
          category_name: category,
          category_amount: amount,
        });
      }
    }
  },
};
