import bcrypt from "bcrypt";
export default {
  hashPassword: async ({ password }: { password: string }) => {
    return await bcrypt.hash(password, 10);
  },
  VerifyPassword: async ({
    password,
    existingPassword,
  }: {
    password: string;
    existingPassword: string;
  }) => {
    return await bcrypt.compare(password, existingPassword);
  },
};
