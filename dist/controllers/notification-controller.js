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
Object.defineProperty(exports, "__esModule", { value: true });
exports.rescheduleRecurringTransaction = exports.updateNotification = exports.fetchAllNotifications = void 0;
const notification_service_1 = require("../services/notification-service");
const error_handlers_1 = require("../utils/error-handlers");
exports.fetchAllNotifications = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const notifications = yield (0, notification_service_1.fetchNotificatios)({ user });
    res.status(200).json({
        status: "success",
        message: "notifications fetch successfull",
        data: notifications,
    });
}));
exports.updateNotification = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, user } = req;
    const { id } = req.params;
    const response = yield (0, notification_service_1.updateNotificationById)({ id, body, user });
    res.status(200).json({
        status: "success",
        message: response === null || response === void 0 ? void 0 : response.message,
    });
}));
exports.rescheduleRecurringTransaction = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, user } = req;
    const { id } = req.params;
    const response = yield (0, notification_service_1.rescheduleRecurringTransactionById)({
        body,
        id,
        user,
    });
    res.status(200).json({ status: "success", messages: response === null || response === void 0 ? void 0 : response.message });
}));
