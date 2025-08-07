import budgetRepository from "../repositories/budget-repository";

type BudgetWithCategory = {
  user_id: string;
  category_name: string;
  transaction_amount?: number;
};

export default {
  findOneBudgetWithCategory: async ({
    user_id,
    category_name,
  }: BudgetWithCategory) => {
    return await budgetRepository.findOneByName({ category_name, user_id });
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
    const totalSpentAmount = totalSpent + transaction_amount!

    // mesure the progress percentage
    const progress = Math.min(
      (totalSpentAmount / Number(exisingBudget?.amount_limit)) * 100,
      100
    );

    // finally update with budget
    await budgetRepository.updateProgress({
      category_name,
      progress,
      total_spent: totalSpentAmount,
      user_id,
    });
  },
};
