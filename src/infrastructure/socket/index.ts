import http from "http";
import { Server } from "socket.io";
import { ISocket } from "../../shared/types/ISocket";

export default class Socket implements ISocket {
  private io: Server | null = null;

  init(server: http.Server): void {
    this.io = new Server(server, {
      cors: {
        origin: (origin, callback) => {
          const allowedOrigins = [
            "https://abacuss.online",
            "https://www.abacuss.online",
          ];
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      },
    });
  }

  connect(): void {
    if (!this.io) {
      console.log("IO NOT INITIALIZED,FIRST INITIALIZE SOCKET".red.yellow);
      return;
    }

    this.io.on("connection", async (socket) => {
      socket.on("register", ({ userId }) => {
        socket.join(userId);
      });

      socket.on("disconnect", () => {});
    });
  }

  disconnect(): void {
    if (!this.io) {
      console.log("IO NOT INITIALIZED,FIRST INITIALIZE SOCKET".red.yellow);
      return;
    }

    console.log("SOCKET IS GOING TO DOWN....".yellow);
    this.io.disconnectSockets();
    console.log("SOCKET DOWN....".yellow);
  }
}
