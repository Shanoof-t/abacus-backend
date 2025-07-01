import User from "../entities/User";

export interface IUserRepository {
  findOneWithEmail(email: string): Promise<User | undefined>;
  create({
    email,
    password,
    user_name,
  }: {
    email: string;
    password: string;
    user_name: string;
  }): Promise<User>;
}
