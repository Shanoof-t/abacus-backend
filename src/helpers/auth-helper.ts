import otpGenerator from "otp-generator";
import { OneTimePassword } from "../models/otp-verification-model";
import { CreateOTP } from "../types/auth-types";
export default {
  generateOTP: () => {
    return otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      digits: true,
      specialChars: false,
    });
  },
  createOneTimePassword: async ({ _id, hashedOTP, email }: CreateOTP) => {
    return await OneTimePassword.create({
      userId: _id,
      email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: new Date(Date.now() + 60 * 1000),
    });
  },
};
