import { query } from "../../loaders/db";
import { IChatbot } from "../../types/chatbot-types";

export const create = async ({ data }: { data: IChatbot }) => {
  const { answer, answer_type, prompt, user_id } = data;

  const queryText = `INSERT INTO conversations(user_id,prompt,answer,answer_type) VALUES ($1,$2,$3::jsonb,$4) RETURNING *`;
  const params = [user_id, prompt, JSON.stringify(answer), answer_type];

  const res = await query(queryText, params);
  return res.rows[0];
};

const find = async (data: { userId: string }): Promise<IChatbot[]> => {
  const { userId } = data;
  const queryText = "SELECT * FROM conversations WHERE user_id=$1 ";
  const params = [userId];
  const res = await query(queryText, params);
  return res.rows;
};

export default {
  create,
  find,
};
