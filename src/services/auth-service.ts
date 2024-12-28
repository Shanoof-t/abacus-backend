import { User } from "../models/user-model";

export const createUser = async (user: { email: string; password: string }) => {
  return await User.create(user);
};
