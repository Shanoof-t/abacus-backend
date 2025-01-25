import { Types } from "mongoose";

export type UserType = {
  email: string;
  password: string;
  user_name: string;
  _id?: Types.ObjectId | string;
};
