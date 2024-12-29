import { User } from "../models/user-model";
import { UserType } from "../types/user-types";
import securityHelper from "./security-helper";

export default {
  getUser: async ({ email }: { email: string }) => {
    return await User.findOne({ email });
  },
  addUser: async (user: UserType) => {
    const { email, password } = user;
    const hashedPassword = await securityHelper.hashPassword({ password });
    return await User.create({ email, password: hashedPassword });
  },
};
