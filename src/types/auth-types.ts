import { Types } from "mongoose";

export type SignIn = { email: string; password: string };
export type SignUp = {
  _id?: Types.ObjectId;
  email: string;
  password: string;
};
export type CreateOTP = {
  _id: Types.ObjectId;
  email: string;
  hashedOTP?: string;
};

export type OtpBody = {
  userId: string;
  otp: string;
};
