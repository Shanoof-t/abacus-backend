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
  const response = await aiApiClient.post(
    "/webhooks/rest/webhook",
    body
  );
  return response.data;
};
