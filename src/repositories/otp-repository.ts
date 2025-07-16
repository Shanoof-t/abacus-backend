import otpModel from "../models/postgres/otp-model";
import { IOtp } from "../types";

const model = otpModel;

const create = async (data: IOtp): Promise<IOtp> => {
  return await model.create(data);
};

const findOne = async (userId: string): Promise<IOtp> => {
  return await model.findOne(userId);
};

const deleteOne = async (userId: string): Promise<IOtp> => {
  return await model.deleteOne(userId);
};

export default { create, findOne, deleteOne };
