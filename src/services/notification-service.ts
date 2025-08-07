import { format } from "date-fns";
import transactionHelper from "../helpers/transaction-helper";

import CustomError from "../utils/Custom-error";
import { User } from "../types";
import notificationRepository from "../repositories/notification-repository";
import transactionRepository from "../repositories/transaction-repository";

export const fetchNotificatios = async ({ user }: { user?: User }) => {
  if (!user) throw new CustomError("User is missing", 404);
  const notifications = await notificationRepository.findByUserId(user.sub);
  return notifications;
};

type UpdateNotification = {
  id: string;
  body: { action: "ESTIMATED" | "CANCEL_RECURRING" };
  user?: User;
};

export const updateNotificationById = async ({
  id,
  body,
  user,
}: UpdateNotification) => {
  if (!user) throw new CustomError("User is missing", 404);

  await notificationRepository.updateMarkAsRead(id, { is_read: true });

  const { action } = body;

  if (action === "ESTIMATED") {
    const notification = await notificationRepository.findById(id);

    if (!notification.future_payload)
      throw new CustomError("Notification is misssing!", 404);

    const transactionId = notification.future_payload;

    const existingTransaction = await transactionRepository.findOneById(
      transactionId
    );

    if (
      !existingTransaction.next_date &&
      !existingTransaction.recurring_frequency
    )
      throw new CustomError("Recurring Transaction is missing", 404);

    const next_date = transactionHelper.calculateNextRecurringDate({
      transaction_date: existingTransaction.next_date?.toString(),
      recurring_frequency: existingTransaction.recurring_frequency!,
    });

    const transaction = await transactionRepository.create({
      user_id: existingTransaction?.user_id,
      transaction_date: existingTransaction.next_date?.toString()!,
      account_name: existingTransaction?.account_name,
      transaction_amount: existingTransaction?.transaction_amount,
      category_name: existingTransaction?.category_name,
      transaction_payee: existingTransaction?.transaction_payee,
      transaction_type: existingTransaction?.transaction_type,
      transaction_note: existingTransaction?.transaction_note,
      is_estimated: true,
      is_recurring: true,
      recurring_frequency: existingTransaction.recurring_frequency,
      next_date,
    });

    // set next reccuring notification

    if (next_date) {
      const cronExpression = transactionHelper.formatCornExpression({
        next_date,
      });

      await transactionHelper.scheduleRecurringNotification({
        category_name: transaction.category_name,
        cronExpression,
        recurring_frequency: transaction.recurring_frequency!,
        transaction_amount: transaction.transaction_amount,
        transaction_type: transaction.transaction_type,
        user,
        transaction_id: transaction.id,
      });

      await notificationRepository.deleteById(id);
      // delete after created new notification
      return { message: "The scheduled recurring transaction is estimated" };
    }
  } else if (action === "CANCEL_RECURRING") {
    await notificationRepository.deleteById(id);
    return { message: "The reccuring transaction is cancled" };
  } else {
    throw new CustomError(`This action ${action} is incurrect`, 400);
  }
};

export const rescheduleRecurringTransactionById = async ({
  body,
  id,
  user,
}: {
  body: { date: string };
  id: string;
  user?: User;
}) => {
  if (!user) throw new CustomError("User is missing", 404);

  const notification = await notificationRepository.findById(id);
  const transactionId = notification?.future_payload;
  const nextDate = body.date;

  const transaction = await transactionRepository.findOneById(transactionId!);

  if (nextDate) {
    const cronExpression = transactionHelper.formatCornExpression({
      next_date: nextDate,
    });

    await transactionHelper.scheduleRecurringNotification({
      category_name: transaction?.category_name,
      cronExpression,
      recurring_frequency: transaction?.recurring_frequency!,
      transaction_amount: transaction?.transaction_amount,
      transaction_type: transaction?.transaction_type,
      user,
      transaction_id: transaction?.id,
    });
    await notificationRepository.deleteById(id);
    return {
      message: `Your Transaction rescheduled on ${format(
        nextDate,
        "MMMM do R"
      )}`,
    };
  }
};
