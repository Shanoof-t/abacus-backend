export interface INotification {
  id?: string;
  user_id: string;
  message: string;
  title: string;
  status: "PENDING" | "SENT" | "FAILED";
  is_read: boolean;
  is_server_notification: boolean;
  future_payload?: string;
}
