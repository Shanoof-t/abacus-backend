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
  createOneTimePassword: async ({ _id, hashedOTP }: CreateOTP) => {
    return await OneTimePassword.create({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60 * 1000,
    });
  },
};
