export const calculateBudgetProgress = ({
  budgetLimit,
  totalSpentAmount,
}: {
  totalSpentAmount: number;
  budgetLimit: number;
}) => {
  return Math.round(Math.min((totalSpentAmount / budgetLimit) * 100, 100));
};
