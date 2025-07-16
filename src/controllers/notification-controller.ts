import {
  fetchNotificatios,
  rescheduleRecurringTransactionById,
  updateNotificationById,
} from "../services/notification-service";
import { asyncErrorHandler } from "../utils/error-handlers";

export const fetchAllNotifications = asyncErrorHandler(async (req, res) => {
  const { user } = req;
  const notifications = await fetchNotificatios({ user });

  res.status(200).json({
    status: "success",
    message: "notifications fetch successfull",
    data: notifications,
  });
});

export const updateNotification = asyncErrorHandler(async (req, res) => {
  const { body, user } = req;
  const { id } = req.params;

  const response:
    | {
        message: string;
      }
    | undefined = await updateNotificationById({ id, body, user });
  res.status(200).json({
    status: "success",
    message: response?.message,
  });
});

export const rescheduleRecurringTransaction = asyncErrorHandler(
  async (req, res) => {
    const { body, user } = req;
    const { id } = req.params;
    const response:
      | {
          message: string;
        }
      | undefined = await rescheduleRecurringTransactionById({
      body,
      id,
      user,
    });
    res.status(200).json({ status: "success", messages: response?.message });
  }
);
