import express from "express";
import authenticateToken from "../../middlewares/jwt-authentication-middleware";
import {
  createChatbotAnswer,
  getChats,
} from "../../controllers/chatbot-controller";

const chatbotRouter = express.Router();

chatbotRouter.use(authenticateToken);

chatbotRouter.route("/").post(createChatbotAnswer).get(getChats);

export default chatbotRouter;
