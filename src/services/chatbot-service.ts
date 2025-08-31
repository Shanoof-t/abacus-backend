import { createAnswer } from "../config/abacus-ai";
import { gemini } from "../config/gemini";
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

  // const response = await gemini({ contents: data.prompt });

  const response = await createAnswer({
    message: data.prompt,
    sender: user.sub,
  });

  return {
    id: Math.random(),
    prompt: data.prompt,
    answer: response[response.length - 1].text,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 123,
    type: "user",
  };
};

export const getChats = () => {
  return [];
};
