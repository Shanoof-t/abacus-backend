import express, { Application } from "express";
import { createServer } from "http";
import loaders from "./loaders";
import sockets from "./sockets";

const app: Application = express();
const server = createServer(app);
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  sockets.init(server);
  
  await loaders({ app, express });


  server.listen(PORT, () => {
    console.log(`Abacus Running On Port:${PORT}`);
  });
};

startServer();
