"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("../../controllers/notification-controller");
const jwt_authentication_middleware_1 = __importDefault(require("../../middlewares/jwt-authentication-middleware"));
const notificationRouter = express_1.default.Router();
notificationRouter.use(jwt_authentication_middleware_1.default);
notificationRouter.route("/").get(notification_controller_1.fetchAllNotifications);
notificationRouter.route("/:id").post(notification_controller_1.updateNotification);
notificationRouter
    .route("/:id/re-schedule-recurring")
    .post(notification_controller_1.rescheduleRecurringTransaction);
exports.default = notificationRouter;
