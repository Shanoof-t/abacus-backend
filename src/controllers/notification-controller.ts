import { CustomeRequest } from "../middlewares/jwt-authentication-middleware";
import {
  fetchNotificatios,
  updateNotificationById,
} from "../services/notification-service";
import { asyncErrorHandler } from "../utils/error-handlers";

export const fetchAllNotifications = asyncErrorHandler(
  async (req: CustomeRequest, res) => {
    const { user } = req;
    const notifications = await fetchNotificatios({ user });

    res.status(200).json({
      status: "success",
      message: "notifications fetch successfull",
      data: notifications,
    });
  }
);

export const updateNotification = asyncErrorHandler(async (req, res) => {
  const { body } = req;
  const { id } = req.params;
  await updateNotificationById({ id, action: body });
  res
    .status(200)
    .json({ status: "success", message: "notification updated successfully" });
});
