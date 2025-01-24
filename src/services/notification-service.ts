import { User as UserType } from "../middlewares/jwt-authentication-middleware";
import { Notification } from "../models/notification-model";

type User = UserType | undefined;
export const fetchNotificatios = async ({ user }: { user: User }) => {
  const notifications = await Notification.find({ user_id: user?.sub });
  // console.log(notifications);
  return notifications;
};

type UpdateNotification = {
  id: string;
  action: "ESTIMETED" | "NOT_ESTIMATED";
};
export const updateNotificationById = async ({
  id,
  action,
}: UpdateNotification) => {
  if (action === "ESTIMETED") {
    await Notification.updateOne({ _id: id }, { $set: { is_read: true } });
  }
};
