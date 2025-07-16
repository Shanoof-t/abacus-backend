import { User } from "../types/user-types";
import CustomError from "../utils/Custom-error";
import { IAccount, IEditAccount } from "../types";
import accountRepository from "../repositories/account-repository";

export const createAccount = async (data: IAccount, user?: User) => {
  const { account_name, account_balance } = data;

  if (!user) throw new CustomError("user is not exist,", 400);

  const existingAccount = await accountRepository.findOneByName({
    account_name,
    user_id: user?.sub,
  });

  if (existingAccount)
    throw new CustomError("This name with account is already created.", 400);

  const accData: IAccount = {
    account_balance,
    account_name,
    user_id: user?.sub,
  };
  return await accountRepository.create(accData);
};

export const fetchAllAccountsByUserId = async (user?: User) => {
  if (!user) throw new CustomError("User not exist.", 404);
  return await accountRepository.findByUserId(user?.sub);
};

export const deleteAccounts = async (accountIds: string[]) => {
  return await accountRepository.deleteMany(accountIds);
};

export const deleteAccountById = async (id: string) => {
  const existingAccount = await accountRepository.findOneById(id);
  if (!existingAccount)
    throw new CustomError(
      "The account you are trying to delete does not exist.",
      404
    );

  return await accountRepository.deleteOneById(id);
};

export const editAccountById = async ({ body, id, user }: IEditAccount) => {
  const { account_name, account_balance } = body;

  if (!user) throw new CustomError("user is not exist,", 400);

  const existingAccountWithId = await accountRepository.findOneById(id);

  if (!existingAccountWithId)
    throw new CustomError(
      "The account you are trying to edit does not exist.",
      404
    );

  if (existingAccountWithId.account_name !== account_name) {
    const existingAccount = await accountRepository.findOneByName({
      account_name,
      user_id: user?.sub,
    });

    if (existingAccount)
      throw new CustomError(
        `An account with the name "${account_name}" already exists.`,
        409
      );
  }

  const data: IAccount = {
    id,
    account_balance,
    account_name,
    user_id: user?.sub,
  };

  return await accountRepository.updateOneById(data);
};

export const fetchAccountById = async (id: string) => {
  const account = await accountRepository.findOneById(id);

  if (!account)
    throw new CustomError(
      "The account you are trying to get does not exist.",
      404
    );
  return account;
};
