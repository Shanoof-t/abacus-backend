import authRouter from "../routes/v1/auth-routes";
import transactionRoute from "../routes/v1/transaction-routes";
import { LoaderParams } from "../types/loader-types";

export default ({ app }: LoaderParams) => {
  app.use("/api/v1/auth", authRouter);

  app.use("/api/v1/transaction", transactionRoute);
};
