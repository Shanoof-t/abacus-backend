import { Application } from "express";

export type LoaderParams = {
  app: Application;
  express: typeof import("express");
};
