import accountRouter from "../routes/v1/account-routes";
import authRouter from "../routes/v1/auth-routes";
import categoryRouter from "../routes/v1/category-routes";
import transactionRoute from "../routes/v1/transaction-routes";
import budgetRouter from "../routes/v1/budget-routes";
import { LoaderParams } from "../types/loader-types";
import statisticsRouter from "../routes/v1/statistics-routes";
import notificationRouter from "../routes/v1/notification-routes";
import bankRouter from "../routes/v1/bank-router";

export default ({ app }: LoaderParams) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/transaction", transactionRoute);
  app.use("/api/v1/account", accountRouter);
  app.use("/api/v1/category", categoryRouter);
  app.use("/api/v1/budget", budgetRouter);
  // app.use("/api/v1/statistics", statisticsRouter);
  // app.use("/api/v1/notifications", notificationRouter);
  // app.use("/api/v1/bank", bankRouter);
};
