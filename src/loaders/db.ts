import mongoose from "mongoose";

export default async () => {
  const uri =
    "mongodb+srv://shanoof:abacus@cluster0.3s16r.mongodb.net/abacus?retryWrites=true&w=majority&appName=Cluster0";
  const conn = await mongoose.connect(uri);
  return conn.connection;
};
