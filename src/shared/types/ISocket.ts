import http from "http";

export interface ISocket {
  init(server: http.Server): void;
  connect(): void;
  disconnect(): void;
}
