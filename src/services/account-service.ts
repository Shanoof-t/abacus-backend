import { User } from "../types/user-types";
import { Account } from "../models/mongodb/account-model";
import CustomError from "../utils/Custom-error";
import { ObjectId } from "mongodb";

type CreateAccount = { account_name: string; account_balance: number };

export const createAccount = async (data: CreateAccount, user?: User) => {
  const { account_name, account_balance } = data;

  const existingAccount = await Account.findOne({ account_name: account_name });

  if (existingAccount)
    throw new CustomError("This name with account is already created.", 400);

  return await Account.create({
    user_id: user?.sub,
    account_name: account_name.replace(/\W/g, ""),
    account_balance: account_balance || 0,
  });
};

export const fetchAllAccountsByUserId = async (user?: User) => {
  return await Account.find({ user_id: user?.sub });
};

export const deleteAccounts = async (accountIds: string[]) => {
  const ids = accountIds.map((accountId) => new ObjectId(accountId));
  await Account.deleteMany({ _id: { $in: ids } });
};

export const deleteAccountById = async (id: string) => {
  await Account.deleteOne({ _id: id });
};

type EditAccout = {
  body: CreateAccount;
  id: string;
  user?: User;
};

export const editAccountById = async ({ body, id, user }: EditAccout) => {
  const existingAccount = await Account.findOne({
    account_name: body.account_name,
  });

  if (existingAccount)
    throw new CustomError(
      `Already an account existin with this name ${body.account_name}`,
      400
    );

  await Account.updateOne(
    { user_id: user?.sub, _id: id },
    {
      $set: {
        account_name: body.account_name,
        account_balance: body.account_balance,
      },
    }
  );
};

export const fetchAccountById = async (id: string) => {
  return await Account.findOne({ _id: id });
};
