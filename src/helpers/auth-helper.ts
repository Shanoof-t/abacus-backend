import otpGenerator from "otp-generator";
import { CreateOTP } from "../types/auth-types";
import otpRepository from "../repositories/otp-repository";

export default {
  generateOTP: () => {
    return otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      digits: true,
      specialChars: false,
    });
  },
  createOneTimePassword: async (data: CreateOTP) => {
    return await otpRepository.create(data);
  },
  getUserDataFromGoogle: async (access_token: unknown) => {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    );
    return await response.json();
  },
};
