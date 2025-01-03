import { Types } from "mongoose";

export type UserType = {
  email: string;
  password: string;
  _id?: Types.ObjectId | string;
};

