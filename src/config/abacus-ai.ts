import CustomError from "../utils/Custom-error";
import aiApiClient from "./axios.ai.config";

export const createAnswer = async (body: {
  sender: string;
  message: string;
}): Promise<
  {
    recipient_id: string;
    text: string;
  }[]
> => {
  try {
    const response = await aiApiClient.post("/webhooks/rest/webhook", body);
    return response.data;
  } catch (error: any) {
    const errorCodes = [401, 403, 406, 500];
    if (errorCodes.find((code) => code === error.code)) {
      throw new CustomError(error.message, error.code);
    } else {
      throw new CustomError("Something wrong happened with ai!", 500);
    }
  }
};
