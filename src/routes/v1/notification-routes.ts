import express from "express";
import { fetchAllNotifications, updateNotification } from "../../controllers/notification-controller";
import authenticateToken from "../../middlewares/jwt-authentication-middleware";

const notificationRouter = express.Router();

notificationRouter.use(authenticateToken);
notificationRouter.route("/").get(fetchAllNotifications);
notificationRouter.route("/:id").post(updateNotification);

export default notificationRouter;
