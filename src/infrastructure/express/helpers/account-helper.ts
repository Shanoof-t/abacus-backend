import { z } from "zod";
import { User } from "../middlewares/jwt-authentication-middleware";
import { Account } from "../models/account-model";
import CustomError from "../utils/Custom-error";
import schema from "../schema/transaction-schema";

type UpdateAccountBalance = {
  transaction_amount: number;
  account_name: string;
  user?: User;
  transaction_type: string;
  accountSource?: "manual" | "bank_integration" | "both";
};

async function updateAccountBalance({
  account_name,
  transaction_amount,
  user,
  transaction_type,
  accountSource = "manual",
}: UpdateAccountBalance) {
  const currentAccount = await Account.findOne({
    user_id: user?.sub,
    account_name,
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

  await Account.updateOne(
    { user_id: user?.sub, account_name },
    {
      $set: {
        account_balance: balance,
        account_source:
          currentAccount.account_source === "bank_integration"
            ? "both"
            : accountSource,
      },
    }
  );

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

type CreateAccounts = {
  transactions: z.infer<typeof schema.add>[];
  user: User | undefined;
  accountSource?: "manual" | "bank_integration" | "both";
};

async function createAccounts({
  transactions,
  user,
  accountSource = "manual",
}: CreateAccounts) {
  if (!user?.sub) return;

  for (const transaction of transactions) {
    const { account_name, transaction_amount, transaction_type } = transaction;
    const amount = Number(transaction_amount);

    const existingAccount = await Account.findOne({
      user_id: user.sub,
      account_name,
    });

    if (existingAccount) {
      const updatedBalance =
        transaction_type === "expense"
          ? Math.max(0, existingAccount.account_balance - amount)
          : existingAccount.account_balance + amount;

      let source: "manual" | "bank_integration" | "both" =
        existingAccount.account_source;

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

      await Account.create({
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
