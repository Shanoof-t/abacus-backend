import { z } from "zod";
import CustomError from "../utils/Custom-error";
import schema from "../schema/transaction-schema";
import {
  IAccount,
  ICreateAccounts,
  IUpdateAccountBalance,
  User,
} from "../types";
import accountRepository from "../repositories/account-repository";

async function updateAccountBalance({
  account_name,
  transaction_amount,
  user,
  transaction_type,
  accountSource = "manual",
}: IUpdateAccountBalance) {
  const currentAccount = await accountRepository.findOneByName({
    account_name,
    user_id: user?.sub,
  });

  if (!currentAccount)
    throw new CustomError(
      `Can't find Account with this name ${account_name}`,
      404
    );

  const balance =
    transaction_type === "expense"
      ? Math.max(0, currentAccount?.account_balance - transaction_amount)
      : currentAccount?.account_balance + transaction_amount;

  const account_source =
    currentAccount.account_source === "bank_integration"
      ? "both"
      : accountSource;

  const data: IAccount = {
    account_balance: balance,
    account_name,
    account_source,
    user_id: user.sub,
    id: currentAccount.id,
  };

  await accountRepository.updateOneById(data);

  // await Account.updateOne(
  //   { user_id: user?.sub, account_name },
  //   {
  //     $set: {
  //       account_balance: balance,
  //       account_source:
  //         currentAccount.account_source === "bank_integration"
  //           ? "both"
  //           : accountSource,
  //     },
  //   }
  // );

  // if (currentAccount.account_source === "bank_integration") {
  //   await Account.updateOne(
  //     { user_id: user?.sub, account_name },
  //     {
  //       $set: {
  //         account_source: "both",
  //       },
  //     }
  //   );
  // }
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
