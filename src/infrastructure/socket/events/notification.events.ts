import sockets from "..";

interface INotification {
  message: string;
  status: "PENDING" | "SENT" | "FAILED";
  user_id: string;
  title: string;
  is_read: boolean;
  is_server_notification: boolean;
  future_payload?: string | null | undefined;
}

function sendRecurringNotification({
  userId,
  notification,
}: {
  userId: string;
  notification: INotification;
}) {
  const io = sockets.getIO();
  io.to(userId).emit("notification:send", notification);
}

export default {
  sendRecurringNotification,
};
