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
const notification_model_1 = require("../models/notification-model");
const transaction_model_1 = require("../models/transaction-model");
const Custom_error_1 = __importDefault(require("../utils/Custom-error"));
const fetchNotificatios = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user }) {
    const notifications = yield notification_model_1.Notification.find({ user_id: user === null || user === void 0 ? void 0 : user.sub });
    return notifications;
});
exports.fetchNotificatios = fetchNotificatios;
const updateNotificationById = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, body, user, }) {
    var _b, _c, _d, _e, _f, _g;
    yield notification_model_1.Notification.updateOne({ _id: id }, { $set: { is_read: true } });
    const { action } = body;
    if (action === "ESTIMATED") {
        const notification = yield notification_model_1.Notification.findOne({ _id: id });
        const transactionId = notification === null || notification === void 0 ? void 0 : notification.future_payload;
        const existingTransaction = yield transaction_model_1.Transaction.findOne({
            _id: transactionId,
        });
        const next_date = transaction_helper_1.default.calculateNextRecurringDate({
            transaction_date: (_c = (_b = existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.recurring) === null || _b === void 0 ? void 0 : _b.next_date) === null || _c === void 0 ? void 0 : _c.toString(),
            recurring_frequency: (_d = existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.recurring) === null || _d === void 0 ? void 0 : _d.recurring_frequency,
        });
        const transaction = yield transaction_model_1.Transaction.create({
            user_id: existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.user_id,
            transaction_date: (_e = existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.recurring) === null || _e === void 0 ? void 0 : _e.next_date,
            account_name: existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.account_name,
            transaction_amount: existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.transaction_amount,
            category_name: existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.category_name,
            transaction_payee: existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.transaction_payee,
            transaction_type: existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.transaction_type,
            transaction_note: existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.transaction_note,
            is_estimated: true,
            is_recurring: true,
            recurring: {
                recurring_frequency: (_f = existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.recurring) === null || _f === void 0 ? void 0 : _f.recurring_frequency,
                next_date,
            },
        });
        // set next reccuring notification
        if (next_date) {
            const cronExpression = transaction_helper_1.default.formatCornExpression({
                next_date,
            });
            yield transaction_helper_1.default.scheduleRecurringNotification({
                category_name: transaction.category_name,
                cronExpression,
                recurring_frequency: (_g = transaction.recurring) === null || _g === void 0 ? void 0 : _g.recurring_frequency,
                transaction_amount: transaction.transaction_amount.toString(),
                transaction_type: transaction.transaction_type,
                user,
                transaction_id: transaction._id,
            });
            // delete after created new notification
            yield notification_model_1.Notification.deleteOne({ _id: id });
            return { message: "The scheduled recurring transaction is estimated" };
        }
    }
    else if (action === "CANCEL_RECURRING") {
        yield notification_model_1.Notification.deleteOne({ _id: id });
        return { message: "The reccuring transaction is cancled" };
    }
    else {
        throw new Custom_error_1.default(`This action ${action} is incurrect`, 400);
    }
});
exports.updateNotificationById = updateNotificationById;
const rescheduleRecurringTransactionById = (_a) => __awaiter(void 0, [_a], void 0, function* ({ body, id, user, }) {
    var _b;
    const notification = yield notification_model_1.Notification.findById(id);
    const transactionId = notification === null || notification === void 0 ? void 0 : notification.future_payload;
    const nextDate = body.date;
    const transaction = yield transaction_model_1.Transaction.findById(transactionId);
    if (nextDate) {
        const cronExpression = transaction_helper_1.default.formatCornExpression({
            next_date: nextDate,
        });
        yield transaction_helper_1.default.scheduleRecurringNotification({
            category_name: transaction === null || transaction === void 0 ? void 0 : transaction.category_name,
            cronExpression,
            recurring_frequency: (_b = transaction === null || transaction === void 0 ? void 0 : transaction.recurring) === null || _b === void 0 ? void 0 : _b.recurring_frequency,
            transaction_amount: transaction === null || transaction === void 0 ? void 0 : transaction.transaction_amount.toString(),
            transaction_type: transaction === null || transaction === void 0 ? void 0 : transaction.transaction_type,
            user,
            transaction_id: transaction === null || transaction === void 0 ? void 0 : transaction._id,
        });
        yield notification_model_1.Notification.deleteOne({ _id: id });
        return {
            message: `Your Transaction rescheduled on ${(0, date_fns_1.format)(nextDate, "MMMM do R")}`,
        };
    }
});
exports.rescheduleRecurringTransactionById = rescheduleRecurringTransactionById;
