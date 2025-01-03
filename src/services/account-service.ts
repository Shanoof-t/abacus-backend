import { User as UserType } from "../middlewares/jwt-authentication-middleware";
import { User } from "../models/user-model";
type CreateAccount = { account_name: string };

export const createAccount = async (
  data: CreateAccount,
  user: UserType | undefined
) => {
  const { account_name } = data;

  await User.updateOne(
    { _id: user?.sub },
    { $push: { accounts: account_name } }
  );
};
