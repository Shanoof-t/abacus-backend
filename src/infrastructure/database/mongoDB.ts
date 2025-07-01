import mongoose from "mongoose";
import env from "../config/environment";

export default async () => {
  const conn = await mongoose.connect(env.MONGO_URL);
  const db = conn.connection;
  console.log(`monogodb connected:${db.host}`.cyan.underline);
  console.log(`Connected to the database : ${db.db?.databaseName}`.green.bold);
};
