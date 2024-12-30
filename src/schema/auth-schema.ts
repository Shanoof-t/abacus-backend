import { z } from "zod";

const signUp = z.object({
  email: z.string().email(),
  password: z.string(),
});

const signIn = z.object({
  email: z.string().email(),
  password: z.string(),
});

const verifyOTP = z.object({
  userId: z.string(),
  otp: z.string(),
});

const schema = {
  signUp,
  signIn,
  verifyOTP,
};

export default schema;
