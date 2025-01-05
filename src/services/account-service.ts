import { User as UserType } from "../middlewares/jwt-authentication-middleware";
import { Account } from "../models/account-model";
import CustomError from "../utils/Custom-error";
import { ObjectId } from "mongodb";
type CreateAccount = { account_name: string; account_balance: number };

export const createAccount = async (
  data: CreateAccount,
  user: UserType | undefined
) => {
  const { account_name, account_balance } = data;

  const existingAccount = await Account.findOne({ account_name: account_name });

  if (existingAccount)
    throw new CustomError("This name with account is already created.", 400);

  return await Account.create({
    user_id: user?.sub,
    account_name,
    account_balance,
  });
};

export const fetchAllAccountsByUserId = async (user: UserType | undefined) => {
  return await Account.find({ user_id: user?.sub });
};

export const deleteAccounts = async (accountIds: string[]) => {
  const ids = accountIds.map((accountId) => new ObjectId(accountId));
  const deletedStatus = await Account.deleteMany({ _id: { $in: ids } });
  console.log(deletedStatus);
  return deletedStatus;
};
