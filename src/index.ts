import express, { Application } from "express";
import loaders from "./loaders";

const app: Application = express();

const startServer = async () => {
  await loaders({ app, express });
  const PORT = process.env.PORT || 8080;
  app.listen(PORT,()=>{
    console.log( `Abacus Running On Port:${PORT} `)
  });
};

startServer();
