import { Types } from "mongoose";

export type SignIn = { email: string; password: string };
export type SignUp = {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  user_name: string;
};
export interface IOtp {
  id?: string;
  email: string;
  user_id?: string;
  otp?: string;
  created_at?: Date;
  expires_at?: Date;
}

export interface ICreateOtp {
  user_id?: string;
  email: string;
  id?: string;
  user_name?: string;
}
export type OtpBody = {
  userId: string;
  otp: string;
};
