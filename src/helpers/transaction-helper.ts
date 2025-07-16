import { addDays, addMonths, addWeeks, addYears, format } from "date-fns";
import cron from "node-cron";
import { Notification } from "../models/mongodb/notification-model";
import budgetHelper from "./budget-helper";
import notificationEvents from "../sockets/events/notification.events";
import {
  HandleBudgetUpdate,
  ICalculateNextRecurringDate,
  IHandleRecurring,
  ScheduleRecurringNotification,
} from "../types";

export default {
  // set date
  calculateNextRecurringDate: ({
    recurring_frequency,
    transaction_date,
  }: ICalculateNextRecurringDate) => {
    if (transaction_date && recurring_frequency) {
      switch (recurring_frequency) {
        case "daily":
          return addDays(transaction_date, 1);
        case "weekly":
          return addWeeks(transaction_date, 1);
        case "monthly":
          return addMonths(transaction_date, 1);
        case "yearly":
          return addYears(transaction_date, 1);
        default:
          return;
      }
    }
  },
  // format corn expresstion
  formatCornExpression: ({ next_date }: { next_date: Date | string }) => {
    // create expression elements
    const month = format(next_date, "M");
    const day = format(next_date, "d");
    const minute = format(next_date, "m");
    const hour = format(next_date, "H");

    // format this one tomorrow
    const scheduledTime = `${hour}:${minute} on ${day}-${month}-${new Date(
      next_date
    ).getFullYear()}`;
    console.log(`Scheduled time: ${scheduledTime}`);

    // return "47 20 19 5 *"; // this is only for testing
    return `${minute} ${hour} ${day} ${month} *`;
  },
  //   make recurring task
  scheduleRecurringNotification: async ({
    cronExpression,
    transaction_type,
    transaction_amount,
    category_name,
    recurring_frequency,
    user,
    transaction_id,
  }: ScheduleRecurringNotification) => {
    if (cronExpression) {
      const scheduledTask = cron.schedule(cronExpression, scheduleNotification);

      // notification service
      async function scheduleNotification() {
        if (transaction_amount) {
          console.log("notification scheduler triggered");

          const title = "Recurring Transaction Scheduled";

          const message = `Your recurring <strong>${transaction_type}</strong> transaction of <strong>$${transaction_amount}</strong> for category <strong>"${category_name}"</strong> is scheduled. 
              It is marked as an *estimated transaction* and will occur <strong>${recurring_frequency}</strong>.`;
          const notification = await Notification.create({
            user_id: user?.sub,
            message,
            title,
            is_server_notification: true,
            future_payload: transaction_id,
          });

          notificationEvents.sendRecurringNotification({
            userId: user?.sub?.toString()!,
            notification,
          });

          scheduledTask.stop();
        }
      }
    }
  },
  //   update budget
  handleBudgetUpdateAndCreateAlerts: async ({
    category_name,
    transaction_amount,
    user,
  }: HandleBudgetUpdate) => {
    // const exisingBudget = await budgetHelper.findOneBudgetWithCategory({
    //   user_id: user?.sub,
    //   category_name,
    // });

    // if (!exisingBudget) return;

    // await budgetHelper.updateBudgetAfterTransaction({
    //   user_id: user?.sub,
    //   category_name,
    //   transaction_amount,
    // });

    // const updatedBudget = await budgetHelper.findOneBudgetWithCategory({
    //   user_id: user?.sub,
    //   category_name,
    // });

    // if (updatedBudget?.progress && updatedBudget?.progress >= 100) {
    //   const alertMessage = `Your exceeded ${category_name} by ${updatedBudget.total_spent}`;
    //   return alertMessage;
    // }

    // if (
    //   updatedBudget?.alert_threshold &&
    //   updatedBudget?.progress &&
    //   updatedBudget.progress >= updatedBudget.alert_threshold
    // ) {
    //   const alertMessage = `Your ${category_name} budget is nearing its limit. You’ve spent ${updatedBudget.total_spent}, which is close to the alert threshold of ${updatedBudget.alert_threshold}.`;
    //   return alertMessage;
    // }
    return ""
  },
  handleRecurring: async function ({ transaction, user }: IHandleRecurring) {
    const {
      next_date,
      category_name,
      recurring_frequency,
      transaction_amount,
      transaction_type,
    } = transaction;

    if (next_date) {
      const cronExpression = this.formatCornExpression({
        next_date,
      });

      await this.scheduleRecurringNotification({
        category_name,
        cronExpression,
        recurring_frequency,
        transaction_amount,
        transaction_type,
        user,
        transaction_id: transaction.id,
      });
    }
  },
};
