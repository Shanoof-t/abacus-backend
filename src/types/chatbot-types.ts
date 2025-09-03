export interface IChatbot {
  id?: string;
  user_id: string;
  prompt: string;
  answer: {
    recipient_id: string;
    text: string;
  }[];
  answer_type: "user" | "bot";
  created_at?: string;
  updated_at?: string;
}
