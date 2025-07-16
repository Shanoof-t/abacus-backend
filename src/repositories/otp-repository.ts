import otpModel from "../models/postgres/otp-model";
import { CreateOTP } from "../types/auth-types";

const model = otpModel;

const create = async (data: CreateOTP) => {
  return await model.create(data);
};

const findOne = async (userId: string) => {
  return await model.findOne(userId);
};

const deleteOne = async (userId: string) => {
  return await model.deleteOne(userId);
};

export default { create, findOne, deleteOne };
