import { Application } from "express";
import authRouter from "./v1/auth-routes";
import transactionRoute from "./v1/transaction-routes";
import accountRouter from "./v1/account-routes";
import categoryRouter from "./v1/category-routes";
import budgetRouter from "./v1/budget-routes";
import statisticsRouter from "./v1/statistics-routes";
import notificationRouter from "./v1/notification-routes";
import bankRouter from "./v1/bank-router";

export default ({ app }: { app: Application }) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/transaction", transactionRoute);
  app.use("/api/v1/account", accountRouter);
  app.use("/api/v1/category", categoryRouter);
  app.use("/api/v1/budget", budgetRouter);
  app.use("/api/v1/statistics", statisticsRouter);
  app.use("/api/v1/notifications", notificationRouter);
  app.use("/api/v1/bank", bankRouter);
};
