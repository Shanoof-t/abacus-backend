import { Types } from "mongoose";
import { Budget } from "../models/budget-model";
import { Transaction } from "../models/transaction-model";

type BudgetWithCategory = {
  user_id?: Types.ObjectId;
  category_name: string;
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
  // findOneBudgetWithDate: async function ({user_id,category_name}) {
  //   return await Budget.findOne({
  //     user_id,
  //     category_name,
  //   });
  // },
  updateBudgetAfterTransaction: async function ({
    user_id,
    category_name,
  }: BudgetWithCategory) {
    // find the existing budget
    const exisingBudget = await this.findOneBudgetWithCategory({
      user_id,
      category_name,
    });

    // find the transaction

    const transactions = await Transaction.find({
      user_id,
      transaction_date: {
        $lte: exisingBudget?.budget_end_date,
        $gte: exisingBudget?.budget_start_date,
      },
      category_name,
      transaction_type: "expense",
    });

    // calculate total spented amount
    const totalSpentAmount = transactions.reduce(
      (acc, value) => acc + value.transaction_amount,
      0
    );

    // convert to positive
    const total_spent = Math.abs(totalSpentAmount);

    // mesure the progress percentage
    const progress = Math.min(
      (total_spent / Number(exisingBudget?.amount_limit)) * 100,
      100
    );

    // finally update with budget
    await Budget.updateOne(
      {
        user_id,
        category_name,
      },
      { $set: { total_spent, progress } }
    );
  },
};
