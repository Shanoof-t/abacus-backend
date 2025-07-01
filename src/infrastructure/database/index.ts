import { Mongoose } from "mongoose";
import environment from "../config/environment";
import IDatabase from "../../shared/types/IDatabase"; 

export default class Database implements IDatabase {
  private database: Mongoose;

  constructor(database: Mongoose) {
    this.database = database;
  }

  async connect() {
    const conn = await this.database.connect(environment.MONGO_URL);
    const db = conn.connection;
    console.log(`database connected:${db.host}`.cyan.underline);
    console.log(
      `Connected to the database : ${db.db?.databaseName}`.green.bold
    );
  }

  async disconnect() {
    await this.database.disconnect();
    console.log("database is disconnected...".red.bold);
  }
}
