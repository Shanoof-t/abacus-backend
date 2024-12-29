import mongoose from "mongoose";
import env from "../config/env_variables";

export default async () => {
  const conn = await mongoose.connect(env.MONGO_URL);
  return conn.connection;
};
