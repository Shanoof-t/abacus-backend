import "reflect-metadata"
import "colors";
import BootServer from "./infrastructure/config/bootstrap";
import Database from "./infrastructure/database";
import mongoose from "mongoose";
import Express from "./infrastructure/webserver/server.express";
import Socket from "./infrastructure/socket";

const PORT = process.env.PORT!;

const database = new Database(mongoose);
const framework = new Express();
const socket = new Socket();
const server = new BootServer(database, framework, socket);

const startServer = async () => {
  await server.start(PORT);

  process.on("SIGTERM", async () => {
    await server.stop();
  });
};

startServer();
