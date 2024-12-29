import { User } from "../models/user-model";
import CustomError from "../utils/Custom-error";

export const createUser = async (user: { email: string; password: string }) => {
  const { email } = user;
  const existingUser = await User.findOne({ email });
  if (existingUser)
    throw new CustomError(
      `An account with the email ${email} already exists.`,
      400
    );
  return await User.create(user);
};
