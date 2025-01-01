import { Request } from "express";
import globalErrorHanlder from "../utils/global-error-hanlder";
import routes from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { LoaderParams } from "../types/loader-types";
import session from "express-session";
export default async ({ app, express }: LoaderParams) => {
  app.use(express.json());
  const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ];

  app.use(
    cors<Request>({
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    })
  );
  app.use(cookieParser());
  // app.use(
  //   session({
  //     secret: "your_secure_secret_key",
  //     resave: false,
  //     saveUninitialized: false,
  //   })
  // );

  // app.use((req, res, next) => {
  //   req.session.state = req.session.state || "defaultState";
  //   next();
  // });

  routes({ app, express });

  app.use(globalErrorHanlder);
};

