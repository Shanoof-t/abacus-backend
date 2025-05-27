import { Request } from "express";
import globalErrorHanlder from "../utils/global-error-hanlder";
import routes from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { LoaderParams } from "../types/loader-types";

export default async ({ app, express }: LoaderParams) => {
  app.use(express.json());
  const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://abacuss.online",
    "http://www.abacuss.online",
    "https://abacuss.online",
    "https://www.abacuss.online",
    "http://3.110.46.217:8080",
    "https://3.110.46.217:8080",
  ];

  app.use(
    cors<Request>({
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    })
  );

  app.use(cookieParser());

  routes({ app, express });

  app.use(globalErrorHanlder);
};
