import { IChatbot } from "../types/chatbot-types";
import chatbotModel from "../models/postgres/chatbot-model";

const model = chatbotModel;

export const create = async ({
  data,
}: {
  data: IChatbot;
}): Promise<IChatbot> => {
  return model.create({ data });
};

export const find = async ({
  userId,
}: {
  userId: string;
}): Promise<IChatbot[]> => {
  return model.find({ userId });
};

export default {
  create,
  find
};
