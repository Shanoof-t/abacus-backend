import { Document } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  password: string;
  user_name: string;
  isVerified: boolean;
  picture: string;
  isGoogle: boolean;
  googleId: string;
}
