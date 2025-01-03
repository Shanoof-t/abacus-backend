import { User } from "../models/user-model";
type CreateAccount = { account_name: string };

export const createAccount = async (data: CreateAccount) => {
  const { account_name } = data;
  // await User.updateOne({_id:})
};
