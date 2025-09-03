import { createAnswer } from "../config/abacus-ai";
import chatbotRespository from "../repositories/chatbot-respository";
import { User } from "../types";
import CustomError from "../utils/Custom-error";

export const createChatbotAnswer = async ({
  data,
  user,
}: {
  data: { prompt: string };
  user?: User;
}) => {
  if (!user) throw new CustomError("user is not exist,", 400);

  const response = await createAnswer({
    message: data.prompt,
    sender: user.sub,
  });

  const conversation = await chatbotRespository.create({
    data: {
      prompt: data.prompt,
      answer: response,
      user_id: user.sub,
      answer_type: "user",
    },
  });
  console.log("conversation:", conversation);
  return conversation;
};

export const getChats = async ({ user }: { user?: User }) => {
  if (!user) throw new CustomError("user is not exist,", 400);
  const conversations = await chatbotRespository.find({ userId: user.sub });
  console.log("conversations:", conversations);

  return conversations;
};
