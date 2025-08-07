import { query } from "../../loaders/db";
import { INotification } from "../../types/notification-type";

const create = async (data: INotification): Promise<INotification> => {
  const { user_id, message, title, is_server_notification, future_payload } =
    data;
  const queryText =
    "INSERT INTO notifications (user_id,message,title,is_server_notification,future_payload) VALUES ($1,$2,$3,$4,$5) RETURNING *";
  const params = [
    user_id,
    message,
    title,
    is_server_notification,
    future_payload,
  ];
  const res = await query(queryText, params);
  return res.rows[0];
};

const findByUserId = async (userId: string): Promise<INotification[]> => {
  const queryText = "SELECT * FROM notifications WHERE user_id=$1";
  const params = [userId];
  const res = await query(queryText, params);
  return res.rows;
};

const findById = async (id: string): Promise<INotification> => {
  const queryText = "SELECT * FROM notifications WHERE id=$1";
  const params = [id];
  const res = await query(queryText, params);
  return res.rows[0];
};

const updateMarkAsRead = async (
  id: string,
  { is_read }: { is_read: boolean }
): Promise<INotification> => {
  const queryText =
    "UPDATE notifications SET is_read=$2 WHERE id=$1 RETURNING *";
  const params = [id, is_read];
  const res = await query(queryText, params);
  return res.rows[0];
};

const deleteById = async (id: string): Promise<INotification> => {
  const queryText = "DELETE FROM notifications WHERE id=$1 RETURNING *";
  const params = [id];
  const res = await query(queryText, params);
  return res.rows[0];
};

export default { findByUserId, findById, updateMarkAsRead, deleteById, create };
