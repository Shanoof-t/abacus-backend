import { z } from "zod";
import schema from "../schema/transaction-schema";
import CustomError from "../utils/Custom-error";
import categoryHelper from "../helpers/category-helper";
import transactionHelper from "../helpers/transaction-helper";
import accountHelper from "../helpers/account-helper";
import transactionRepository from "../repositories/transaction-repository";
import { ICreateTransactions, ITransaction, User } from "../types";
import accountRepository from "../repositories/account-repository";
import categoryRepository from "../repositories/category-repository";

export const createTransaction = async (
  body: z.infer<typeof schema.add>,
  user?: User
) => {
  if (!user) {
    throw new CustomError("user is not exist,", 400);
  }

  const {
    account_name,
    category_name,
    transaction_amount,
    transaction_date,
    transaction_payee,
    transaction_note,
    is_recurring,
    recurring_frequency,
    transaction_type,
  } = body;

  const currentAccount = await accountRepository.findOneByName({
    account_name,
    user_id: user?.sub,
  });

  if (!currentAccount)
    throw new CustomError(
      `Can't find Account with this name ${account_name}`,
      404
    );

  const currentCategory = await categoryRepository.findOneByName({
    user_id: user.sub,
    category_name,
  });

  if (!currentCategory)
    throw new CustomError(
      `Can't find Category with this name ${category_name}`,
      404
    );

  let transaction;

  if (is_recurring) {
    const next_date = transactionHelper.calculateNextRecurringDate({
      recurring_frequency,
      transaction_date,
    });

    transaction = await transactionRepository.create({
      user_id: user.sub,
      transaction_date,
      account_name,
      transaction_amount,
      category_name,
      transaction_payee,
      transaction_type,
      transaction_note,
      is_bank_transaction: false,
      is_estimated: true,
      is_recurring,
      next_date,
      recurring_frequency,
    });

    await transactionHelper.handleRecurring({
      transaction,
      user,
    });
  } else {
    transaction = await transactionRepository.create({
      user_id: user.sub,
      transaction_date,
      account_name,
      transaction_amount,
      category_name,
      transaction_payee,
      transaction_type,
      transaction_note,
      is_bank_transaction: false,
      is_estimated: true,
      is_recurring,
    });
  }

  await accountHelper.updateAccountBalance({
    account_name,
    transaction_amount: Number(transaction_amount),
    transaction_type,
    user,
    account: currentAccount,
  });

  // update budget
  if (transaction.transaction_type === "expense") {
    const alert = await transactionHelper.handleBudgetUpdateAndCreateAlerts({
      category_name,
      transaction_amount,
      user,
    });

    if (alert) {
      return { alert, transaction };
    }
  }

  return { transaction };
};

export const fetchAllTransactions = async (user?: User) => {
  if (!user) throw new CustomError("user is not exist,", 400);

  const transactions = await transactionRepository.findById(user.sub);
  return transactions;
};

export const deleteTransactions = async (body: string[]) => {
  const transactions = await transactionRepository.deleteMany(body);
  return transactions;
};

export const deleteTransactionById = async (id: string) => {
  const transaction = await transactionRepository.deleteOneById(id);
  if (!transaction) throw new CustomError("Can't delete transaction.", 400);
  return transaction;
};

export const fetchTransactionById = async (id: string) => {
  const transaction = await transactionRepository.findOneById(id);
  if (!transaction) throw new CustomError("Can't find transaction.", 400);
  return transaction;
};

export const editTransactionById = async (
  body: z.infer<typeof schema.add>,
  id: string,
  user?: User
) => {
  if (!user) throw new CustomError("user is not exist,", 400);

  const currentTransaction = await transactionRepository.findOneById(id);

  if (!currentTransaction)
    throw new CustomError("Can't find transaction.", 400);

  const currentAccount = await accountRepository.findOneByName({
    account_name: body.account_name,
    user_id: user?.sub,
  });

  if (!currentAccount)
    throw new CustomError(
      `Can't find Account with this name ${body.account_name}`,
      404
    );

  const currentCategory = await categoryRepository.findOneByName({
    user_id: user.sub,
    category_name: body.category_name,
  });

  if (!currentCategory)
    throw new CustomError(
      `Can't find Category with this name ${body.category_name}`,
      404
    );

  const transaction_type = body.transaction_amount > 0 ? "income" : "expense";

  const updatedTransaction: ITransaction = {
    account_name: body.account_name,
    category_name: body.category_name,
    transaction_amount: body.transaction_amount,
    transaction_date: body.transaction_date,
    transaction_payee: body.transaction_payee,
    transaction_type,
    user_id: user.sub,
  };

  const transaction = await transactionRepository.updateOneById(
    id,
    updatedTransaction
  );

  return transaction;
};

export const createTransactions = async ({
  body,
  user,
}: ICreateTransactions) => {
  if (!user) throw new CustomError("user is not exist,", 400);

  const user_id = user.sub;

  const adjustedTransactions: ITransaction[] = body.map((transaction) => {
    const transaction_type =
      transaction.transaction_amount > 0 ? "income" : "expense";

    return {
      ...transaction,
      user_id,
      transaction_type,
      transaction_amount: transaction.transaction_amount,
    };
  });

  // also create the account

  await accountHelper.createAccounts({
    transactions: body,
    user,
  });

  // check category
  await categoryHelper.createCategories({ transactions: body, user });

  const transactions = await transactionRepository.insertMany(
    adjustedTransactions
  );
  return transactions;
};
