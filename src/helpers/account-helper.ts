import CustomError from "../utils/Custom-error";
import { IAccount, ICreateAccounts, IUpdateAccountBalance } from "../types";
import accountRepository from "../repositories/account-repository";

async function updateAccountBalance({
  account_name,
  transaction_amount,
  user,
  transaction_type,
  accountSource = "manual",
  account,
}: IUpdateAccountBalance) {
  const balance =
    transaction_type === "expense"
      ? Math.max(0, account?.account_balance - transaction_amount)
      : account?.account_balance + transaction_amount;

  const account_source =
    account.account_source === "bank_integration"
      ? "both"
      : accountSource;

  const data: IAccount = {
    account_balance: balance,
    account_name,
    account_source,
    user_id: user.sub,
    id: account.id,
  };

  await accountRepository.updateOneById(data);
}

async function createAccounts({
  transactions,
  user,
  accountSource = "manual",
}: ICreateAccounts) {
  if (!user?.sub) return;

  for (const transaction of transactions) {
    const { account_name, transaction_amount, transaction_type } = transaction;
    const amount = Number(transaction_amount);

    const existingAccount = await accountRepository.findOneByName({
      account_name,
      user_id: user.sub,
    });

    if (existingAccount) {
      const updatedBalance =
        transaction_type === "expense"
          ? Math.max(0, existingAccount.account_balance - amount)
          : existingAccount.account_balance + amount;

      let source: "manual" | "bank_integration" | "both" =
        existingAccount.account_source!;

      if (
        existingAccount.account_source === "manual" &&
        accountSource === "bank_integration"
      ) {
        source = "both";
      } else if (
        existingAccount.account_source === "bank_integration" &&
        accountSource === "manual"
      ) {
        source = "both";
      } else if (accountSource === "bank_integration") {
        source = "bank_integration";
      }

      await updateAccountBalance({
        account_name,
        transaction_amount: updatedBalance,
        transaction_type,
        user,
        accountSource: source,
        account: existingAccount,
      });
    } else {
      const initialBalance = transaction_type === "expense" ? 0 : amount;

      await accountRepository.create({
        account_balance: initialBalance,
        account_name,
        user_id: user.sub,
        account_source: accountSource,
      });
    }
  }
}

export default {
  updateAccountBalance,
  createAccounts,
};
