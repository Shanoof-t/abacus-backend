import authRouter from "../routes/v1/auth-routes";
import { LoaderParams } from "../types/LoaderParams";


export default ({ app }: LoaderParams) => {
  app.use("/api/v1/auth", authRouter);
};
