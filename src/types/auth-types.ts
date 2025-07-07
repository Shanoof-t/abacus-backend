import { Types } from "mongoose";

export type SignIn = { email: string; password: string };
export type SignUp = {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  user_name: string;
};
export type CreateOTP = {
  id: string
  email: string;
  hashedOTP?: string;
  userName?: string;
  createdAt?: Date;
  expiresAt?: Date;
};

export type OtpBody = {
  userId: string;
  otp: string;
};
