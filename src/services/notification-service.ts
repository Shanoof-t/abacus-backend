import { format } from "date-fns";
import transactionHelper from "../helpers/transaction-helper";
import { Notification } from "../models/mongodb/notification-model";
import { Transaction } from "../models/mongodb/transaction-model";
import CustomError from "../utils/Custom-error";
import { User } from "../types";


export const fetchNotificatios = async ({ user }: { user: User }) => {
  const notifications = await Notification.find({ user_id: user?.sub });
  return notifications;
};

type UpdateNotification = {
  id: string;
  body: { action: "ESTIMATED" | "CANCEL_RECURRING" };
  user: User;
};

export const updateNotificationById = async ({
  id,
  body,
  user,
}: UpdateNotification) => {
  await Notification.updateOne({ _id: id }, { $set: { is_read: true } });

  const { action } = body;

  if (action === "ESTIMATED") {
    const notification = await Notification.findOne({ _id: id });
    const transactionId = notification?.future_payload;

    const existingTransaction = await Transaction.findOne({
      _id: transactionId,
    });

    const next_date = transactionHelper.calculateNextRecurringDate({
      transaction_date: existingTransaction?.recurring?.next_date?.toString(),
      recurring_frequency: existingTransaction?.recurring?.recurring_frequency!,
    });

    const transaction = await Transaction.create({
      user_id: existingTransaction?.user_id,
      transaction_date: existingTransaction?.recurring?.next_date,
      account_name: existingTransaction?.account_name,
      transaction_amount: existingTransaction?.transaction_amount,
      category_name: existingTransaction?.category_name,
      transaction_payee: existingTransaction?.transaction_payee,
      transaction_type: existingTransaction?.transaction_type,
      transaction_note: existingTransaction?.transaction_note,
      is_estimated: true,
      is_recurring: true,
      recurring: {
        recurring_frequency:
          existingTransaction?.recurring?.recurring_frequency,
        next_date,
      },
    });

    // set next reccuring notification

    if (next_date) {
      const cronExpression = transactionHelper.formatCornExpression({
        next_date,
      });

      await transactionHelper.scheduleRecurringNotification({
        category_name: transaction.category_name,
        cronExpression,
        recurring_frequency: transaction.recurring?.recurring_frequency!,
        transaction_amount: transaction.transaction_amount.toString(),
        transaction_type: transaction.transaction_type,
        user,
        transaction_id: transaction._id,
      });

      // delete after created new notification
      await Notification.deleteOne({ _id: id });
      return { message: "The scheduled recurring transaction is estimated" };
    }
  } else if (action === "CANCEL_RECURRING") {
    await Notification.deleteOne({ _id: id });
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
  user: User;
}) => {
  const notification = await Notification.findById(id);
  const transactionId = notification?.future_payload;
  const nextDate = body.date;

  const transaction = await Transaction.findById(transactionId);

  if (nextDate) {
    const cronExpression = transactionHelper.formatCornExpression({
      next_date: nextDate,
    });

    await transactionHelper.scheduleRecurringNotification({
      category_name: transaction?.category_name,
      cronExpression,
      recurring_frequency: transaction?.recurring?.recurring_frequency!,
      transaction_amount: transaction?.transaction_amount.toString(),
      transaction_type: transaction?.transaction_type,
      user,
      transaction_id: transaction?._id,
    });
    await Notification.deleteOne({ _id: id });
    return {
      message: `Your Transaction rescheduled on ${format(
        nextDate,
        "MMMM do R"
      )}`,
    };
  }
};
