import { Request } from "express";
import globalErrorHanlder from "../utils/global-error-hanlder";
import routes from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { LoaderParams } from "../types/loader-types";
export default async ({ app, express }: LoaderParams) => {
  app.use(express.json());
  app.use(
    cors<Request>({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    })
  );
  app.use(cookieParser());
  routes({ app, express });
  app.use(globalErrorHanlder);
};
