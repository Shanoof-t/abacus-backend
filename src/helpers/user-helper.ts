import { Types } from "mongoose";
import { User } from "../models/user-model";
import { UserType } from "../types/user-types";
import securityHelper from "./security-helper";

type GetUser = {
  _id?: Types.ObjectId | string;
  email?: string;
};

export default {
  getUser: async ({ email, _id }: GetUser) => {
    if (email) {
      return await User.findOne({ email });
    } else if (_id) {
      return await User.findOne({ _id });
    }
  },
  addUser: async (user: UserType) => {
    const { email, password, user_name } = user;
    const hashedPassword = await securityHelper.hashPassword({ password });
    return await User.create({ email, password: hashedPassword, user_name });
  },
};
