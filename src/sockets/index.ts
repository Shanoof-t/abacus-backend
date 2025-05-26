import http from "http";
import { Server, Socket } from "socket.io";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import env from "../config/env_variables";
import { User } from "../middlewares/jwt-authentication-middleware";
let io: Server;
// let socket: Socket | null = null;

function init(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    // here i want to authenticate with auth field
    console.log("socket connected:", socket.id);
    const { ACCESS_TOKEN_SECRET } = env;
    const token = parse(socket.handshake.headers.cookie as string)
      .token as string;
    const user =  jwt.verify(token, ACCESS_TOKEN_SECRET) as User;
    if(user){

    }
    socket.on("register", ({ userId }) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected:", socket.id);
    });
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

// function getSocket() {
// if (!socket) {
//   console.log(
//     "Can't find socket check it on socket config.Maybe not initialized"
//   );
// }
// return socket;
// }

export default {
  init,
  getIO,
  // getSocket,
};
