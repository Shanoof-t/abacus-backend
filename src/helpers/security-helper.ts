import bcrypt from "bcrypt";
import CustomError from "../utils/Custom-error";

type VerifyPassword = {
  password: string;
  existingPassword: string;
};

export default {
  hashPassword: async ({ password }: { password: string }) => {
    return await bcrypt.hash(password, 10);
  },
  hashOTP: async ({ otp }: { otp: string }) => {
    return await bcrypt.hash(otp, 10);
  },
  VerifyPassword: async ({ password, existingPassword }: VerifyPassword) => {
    return await bcrypt.compare(password, existingPassword);
  },
};
