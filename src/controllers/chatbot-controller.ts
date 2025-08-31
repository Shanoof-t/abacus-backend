import { asyncErrorHandler } from "../utils/error-handlers";
import * as chatbotService from "../services/chatbot-service";

export const createChatbotAnswer = asyncErrorHandler(async (req, res) => {
  const data: { prompt: string } = req.body;
  const user = req.user;

  const response = await chatbotService.createChatbotAnswer({ data, user });

  res
    .status(200)
    .json({ status: "success", messages: "Successfull", data: response });
});

export const getChats = asyncErrorHandler(async (req, res) => {
  const response = await chatbotService.getChats();
  res
    .status(200)
    .json({ status: "success", messages: "Successfull", data: response });
});

