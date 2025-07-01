import { createServer, Server } from "http";
import IFramework from "../../shared/types/IFramework";
import express, { Request } from "express";
import routes from "../express/routes/index";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHanlder from "../../shared/utils/global-error-hanlder"; 

export default class Express implements IFramework {
  private framework = express;

  init(): Server {
    const app = this.framework();

    app.use(this.framework.json());

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

    // routes({ app });

    app.use(globalErrorHanlder);

    const server: Server = createServer(app);

    return server;
  }
}
