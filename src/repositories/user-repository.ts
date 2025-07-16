import userModel from "../models/postgres/user-model";
import { UserType } from "../types/user-types";

const model = userModel;

const findOneWithId = async (id: string, isVerified = true) => {
  return await model.findOneWithId(id, isVerified);
};

const findOneWithEmail = async (email: string, isVerified = true) => {
  return await model.findOneWithEmail(email, isVerified);
};

const addUser = async (input: UserType) => {
  return await model.addUser(input);
};

const update = async (userId: string) => {
  return await model.update(userId);
};

export default { findOneWithEmail, findOneWithId, addUser, update };
