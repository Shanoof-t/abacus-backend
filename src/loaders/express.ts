import globalErrorHanlder from "../utils/global-error-hanlder";
import { LoaderParams } from "../utils/types/LoaderParams";
import routes from "./routes";

export default async ({ app, express }: LoaderParams) => {
  app.use(express.json());
  routes({ app, express });
  app.use(globalErrorHanlder);
};
