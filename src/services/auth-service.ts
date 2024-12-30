import userHelper from "../helpers/user-helper";
import CustomError from "../utils/Custom-error";
import { CreateOTP, SignIn, SignUp } from "../types/auth-types";
import securityHelper from "../helpers/security-helper";
import tokenHelper from "../helpers/token-helper";
import authHelper from "../helpers/auth-helper";
import { mailOption, transporter } from "../config/nodemailer";

export const createUser = async (user: SignUp) => {
  const { email } = user;
  const existingUser = await userHelper.getUser({ email });
  if (existingUser)
    throw new CustomError(`You already registered with this email`, 400);
  return await userHelper.addUser(user);
};

export const authenticateUser = async (loginData: SignIn) => {
  const { email, password } = loginData;
  const user = await userHelper.getUser({ email });
  if (!user) throw new CustomError("Your email is incorrect", 404);
  const isPasswordCorrect = await securityHelper.VerifyPassword({
    password,
    existingPassword: user.password,
  });
  if (!isPasswordCorrect)
    throw new CustomError("Check your password again", 401);
  const payload = { sub: user._id, email: user.email };
  const accessToken = tokenHelper.generateToken(payload);
  return { accessToken, user };
};

export const createOTP = async ({ _id, email }: CreateOTP) => {
  const otp = authHelper.generateOTP();

  const hashedOTP = await securityHelper.hashOTP({ otp });

  const OTP = await authHelper.createOneTimePassword({ _id, hashedOTP, email });

  const mailOptions = mailOption({ email, otp });

  return await transporter.sendMail(mailOptions);
};

