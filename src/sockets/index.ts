import http from "http";
import { Server } from "socket.io";

let io: Server;

function init(server: http.Server) {
  io = new Server(server, {
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

  io.on("connection", async (socket) => {
    socket.on("register", ({ userId }) => {
      socket.join(userId);
    });

    socket.on("disconnect", () => {});
  });

  return io;
}

function getIO(): Server {
  if (!io) {
    console.log(
      "Can't find io check it on socket config.Maybe not initialized"
    );
  }
  return io;
}

export default {
  init,
  getIO,
};
