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
exports.rescheduleRecurringTransactionById = exports.updateNotificationById = exports.fetchNotificatios = void 0;
const date_fns_1 = require("date-fns");
const transaction_helper_1 = __importDefault(require("../helpers/transaction-helper"));
const Custom_error_1 = __importDefault(require("../utils/Custom-error"));
const notification_repository_1 = __importDefault(require("../repositories/notification-repository"));
const transaction_repository_1 = __importDefault(require("../repositories/transaction-repository"));
const fetchNotificatios = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user }) {
    if (!user)
        throw new Custom_error_1.default("User is missing", 404);
    const notifications = yield notification_repository_1.default.findByUserId(user.sub);
    return notifications;
});
exports.fetchNotificatios = fetchNotificatios;
const updateNotificationById = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, body, user, }) {
    var _b, _c;
    if (!user)
        throw new Custom_error_1.default("User is missing", 404);
    yield notification_repository_1.default.updateMarkAsRead(id, { is_read: true });
    const { action } = body;
    if (action === "ESTIMATED") {
        const notification = yield notification_repository_1.default.findById(id);
        if (!notification.future_payload)
            throw new Custom_error_1.default("Notification is misssing!", 404);
        const transactionId = notification.future_payload;
        const existingTransaction = yield transaction_repository_1.default.findOneById(transactionId);
        if (!existingTransaction.next_date &&
            !existingTransaction.recurring_frequency)
            throw new Custom_error_1.default("Recurring Transaction is missing", 404);
        const next_date = transaction_helper_1.default.calculateNextRecurringDate({
            transaction_date: (_b = existingTransaction.next_date) === null || _b === void 0 ? void 0 : _b.toString(),
            recurring_frequency: existingTransaction.recurring_frequency,
        });
        const transaction = yield transaction_repository_1.default.create({
            user_id: existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.user_id,
            transaction_date: (_c = existingTransaction.next_date) === null || _c === void 0 ? void 0 : _c.toString(),
            account_name: existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.account_name,
            transaction_amount: existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.transaction_amount,
            category_name: existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.category_name,
            transaction_payee: existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.transaction_payee,
            transaction_type: existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.transaction_type,
            transaction_note: existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.transaction_note,
            is_estimated: true,
            is_recurring: true,
            recurring_frequency: existingTransaction.recurring_frequency,
            next_date,
        });
        // set next reccuring notification
        if (next_date) {
            const cronExpression = transaction_helper_1.default.formatCornExpression({
                next_date,
            });
            yield transaction_helper_1.default.scheduleRecurringNotification({
                category_name: transaction.category_name,
                cronExpression,
                recurring_frequency: transaction.recurring_frequency,
                transaction_amount: transaction.transaction_amount,
                transaction_type: transaction.transaction_type,
                user,
                transaction_id: transaction.id,
            });
            yield notification_repository_1.default.deleteById(id);
            // delete after created new notification
            return { message: "The scheduled recurring transaction is estimated" };
        }
    }
    else if (action === "CANCEL_RECURRING") {
        yield notification_repository_1.default.deleteById(id);
        return { message: "The reccuring transaction is cancled" };
    }
    else {
        throw new Custom_error_1.default(`This action ${action} is incurrect`, 400);
    }
});
exports.updateNotificationById = updateNotificationById;
const rescheduleRecurringTransactionById = (_a) => __awaiter(void 0, [_a], void 0, function* ({ body, id, user, }) {
    if (!user)
        throw new Custom_error_1.default("User is missing", 404);
    const notification = yield notification_repository_1.default.findById(id);
    const transactionId = notification === null || notification === void 0 ? void 0 : notification.future_payload;
    const nextDate = body.date;
    const transaction = yield transaction_repository_1.default.findOneById(transactionId);
    if (nextDate) {
        const cronExpression = transaction_helper_1.default.formatCornExpression({
            next_date: nextDate,
        });
        yield transaction_helper_1.default.scheduleRecurringNotification({
            category_name: transaction === null || transaction === void 0 ? void 0 : transaction.category_name,
            cronExpression,
            recurring_frequency: transaction === null || transaction === void 0 ? void 0 : transaction.recurring_frequency,
            transaction_amount: transaction === null || transaction === void 0 ? void 0 : transaction.transaction_amount,
            transaction_type: transaction === null || transaction === void 0 ? void 0 : transaction.transaction_type,
            user,
            transaction_id: transaction === null || transaction === void 0 ? void 0 : transaction.id,
        });
        yield notification_repository_1.default.deleteById(id);
        return {
            message: `Your Transaction rescheduled on ${(0, date_fns_1.format)(nextDate, "MMMM do R")}`,
        };
    }
});
exports.rescheduleRecurringTransactionById = rescheduleRecurringTransactionById;
