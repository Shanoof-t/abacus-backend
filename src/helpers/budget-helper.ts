import { Types } from "mongoose";
import { Budget } from "../models/budget-model";

type BudgetWithCategory = {
  user_id?: Types.ObjectId;
  category_name: string;
  transaction_amount?: string;
};

export default {
  findOneBudgetWithCategory: async ({
    user_id,
    category_name,
  }: BudgetWithCategory) => {
    return await Budget.findOne({
      user_id,
      category_name,
    });
  },
  updateBudgetAfterTransaction: async function ({
    user_id,
    category_name,
    transaction_amount,
  }: BudgetWithCategory) {
    // find the existing budget
    const exisingBudget = await this.findOneBudgetWithCategory({
      user_id,
      category_name,
    });

    
    // total spent calculation

    const totalSpent = exisingBudget?.total_spent || 0;
    const totalSpentAmount = totalSpent + Number(transaction_amount);

    // mesure the progress percentage
    const progress = Math.min(
      (totalSpentAmount / Number(exisingBudget?.amount_limit)) * 100,
      100
    );

    // finally update with budget
    await Budget.updateOne(
      {
        user_id,
        category_name,
      },
      { $set: { total_spent: totalSpentAmount, progress } }
    );
  },
};
