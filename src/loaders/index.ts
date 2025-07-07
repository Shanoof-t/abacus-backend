import { LoaderParams } from "../types/loader-types";
// import databaseLoader from "./db";
import expressLoader from "./express";
import "colors";

export default async ({ app, express }: LoaderParams) => {
  // const db = await databaseLoader();
  // console.log(`monogodb connected:${db.host}`.cyan.underline);
  // console.log(`Connected to the database : ${db.db?.databaseName}`.green.bold);
  expressLoader({ app, express });
};
