"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const node_cron_1 = __importDefault(require("node-cron"));
const notification_events_1 = __importDefault(require("../sockets/events/notification.events"));
const notification_repository_1 = __importDefault(require("../repositories/notification-repository"));
const budget_helper_1 = __importDefault(require("./budget-helper"));
exports.default = {
    // set date
    calculateNextRecurringDate: ({ recurring_frequency, transaction_date, }) => {
        if (transaction_date && recurring_frequency) {
            switch (recurring_frequency) {
                case "daily":
                    return (0, date_fns_1.addDays)(transaction_date, 1);
                case "weekly":
                    return (0, date_fns_1.addWeeks)(transaction_date, 1);
                case "monthly":
                    return (0, date_fns_1.addMonths)(transaction_date, 1);
                case "yearly":
                    return (0, date_fns_1.addYears)(transaction_date, 1);
                default:
                    return;
            }
        }
    },
    // format corn expresstion
    formatCornExpression: ({ next_date }) => {
        // create expression elements
        const month = (0, date_fns_1.format)(next_date, "M");
        const day = (0, date_fns_1.format)(next_date, "d");
        const minute = (0, date_fns_1.format)(next_date, "m");
        const hour = (0, date_fns_1.format)(next_date, "H");
        // format this one tomorrow
        const scheduledTime = `${hour}:${minute} on ${day}-${month}-${new Date(next_date).getFullYear()}`;
        console.log(`Scheduled time: ${scheduledTime}`);
        // return "47 20 19 5 *"; // this is only for testing
        return `${minute} ${hour} ${day} ${month} *`;
    },
    //   make recurring task
    scheduleRecurringNotification: (_a) => __awaiter(void 0, [_a], void 0, function* ({ cronExpression, transaction_type, transaction_amount, category_name, recurring_frequency, user, transaction_id, }) {
        if (cronExpression) {
            const scheduledTask = node_cron_1.default.schedule(cronExpression, scheduleNotification);
            // notification service
            function scheduleNotification() {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    if (transaction_amount) {
                        console.log("notification scheduler triggered");
                        const title = "Recurring Transaction Scheduled";
                        const message = `Your recurring <strong>${transaction_type}</strong> transaction of <strong>$${transaction_amount}</strong> for category <strong>"${category_name}"</strong> is scheduled. 
              It is marked as an *estimated transaction* and will occur <strong>${recurring_frequency}</strong>.`;
                        const notification = yield notification_repository_1.default.create({
                            user_id: user.sub,
                            message,
                            title,
                            is_server_notification: true,
                            future_payload: transaction_id,
                            is_read: false,
                            status: "PENDING",
                        });
                        notification_events_1.default.sendRecurringNotification({
                            userId: (_a = user === null || user === void 0 ? void 0 : user.sub) === null || _a === void 0 ? void 0 : _a.toString(),
                            notification,
                        });
                        scheduledTask.stop();
                    }
                });
            }
        }
    }),
    //   update budget
    handleBudgetUpdateAndCreateAlerts: (_a) => __awaiter(void 0, [_a], void 0, function* ({ category_name, transaction_amount, user, }) {
        const exisingBudget = yield budget_helper_1.default.findOneBudgetWithCategory({
            user_id: user === null || user === void 0 ? void 0 : user.sub,
            category_name,
        });
        if (!exisingBudget)
            return;
        yield budget_helper_1.default.updateBudgetAfterTransaction({
            user_id: user === null || user === void 0 ? void 0 : user.sub,
            category_name,
            transaction_amount,
        });
        const updatedBudget = yield budget_helper_1.default.findOneBudgetWithCategory({
            user_id: user === null || user === void 0 ? void 0 : user.sub,
            category_name,
        });
        if ((updatedBudget === null || updatedBudget === void 0 ? void 0 : updatedBudget.progress) && (updatedBudget === null || updatedBudget === void 0 ? void 0 : updatedBudget.progress) >= 100) {
            const alertMessage = `Your exceeded ${category_name} by ${updatedBudget.total_spent}`;
            return alertMessage;
        }
        if ((updatedBudget === null || updatedBudget === void 0 ? void 0 : updatedBudget.alert_threshold) &&
            (updatedBudget === null || updatedBudget === void 0 ? void 0 : updatedBudget.progress) &&
            updatedBudget.progress >= updatedBudget.alert_threshold) {
            const alertMessage = `Your ${category_name} budget is nearing its limit. You’ve spent ${updatedBudget.total_spent}, which is close to the alert threshold of ${updatedBudget.alert_threshold}.`;
            return alertMessage;
        }
    }),
    handleRecurring: function (_a) {
        return __awaiter(this, arguments, void 0, function* ({ transaction, user }) {
            const { next_date, category_name, recurring_frequency, transaction_amount, transaction_type, } = transaction;
            if (next_date) {
                const cronExpression = this.formatCornExpression({
                    next_date,
                });
                yield this.scheduleRecurringNotification({
                    category_name,
                    cronExpression,
                    recurring_frequency,
                    transaction_amount,
                    transaction_type,
                    user,
                    transaction_id: transaction.id,
                });
            }
        });
    },
};
