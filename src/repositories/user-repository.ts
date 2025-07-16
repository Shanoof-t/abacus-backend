import userModel from "../models/postgres/user-model";
import { IUser } from "../types/user-types";

const model = userModel;

const findOneWithId = async (id: string, isVerified = true): Promise<IUser> => {
  return await model.findOneWithId(id, isVerified);
};

const findOneWithEmail = async (
  email: string,
  isVerified = true
): Promise<IUser> => {
  return await model.findOneWithEmail(email, isVerified);
};

const addUser = async (input: IUser): Promise<IUser> => {
  return await model.addUser(input);
};

const update = async (userId: string): Promise<IUser> => {
  return await model.update(userId);
};

export default { findOneWithEmail, findOneWithId, addUser, update };
