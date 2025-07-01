import { DefaultEventsMap, Server, Socket } from "socket.io";

export default interface ISocket {
  socket: Socket;
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
}
