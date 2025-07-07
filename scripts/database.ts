import "dotenv/config";
import { Client } from "pg";

const command = process.argv[2];

switch (command) {
  case "-c":
    createDatabase();
    break;

  case "--create":
    createDatabase();
    break;
  case "-d":
    dropDatabase();
    break;
  case "--drop":
    dropDatabase();
    break;
  default:
    console.error("wrong command");
    break;
}

async function createDatabase() {
  const dbname = process.env.DB_NAME;

  if (!dbname) {
    console.error("DB_NAME environment variable is not available");
    return;
  }

  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: "postgres",
  });

  try {
    await client.connect();

    await client.query(`DROP DATABASE IF EXISTS "${dbname}"`);

    await client.query(`CREATE DATABASE "${dbname}"`);

    console.log(`Database "${dbname}" created successfully...`);
  } catch (error) {
    console.error("Error creating database:", error);
  } finally {
    await client.end();
  }
}

async function dropDatabase() {
  const dbname = process.env.DB_NAME;

  if (!dbname) {
    console.error("DB_NAME environment variable is not available");
    return;
  }

  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: "postgres",
  });

  try {
    await client.connect();

    await client.query(`DROP DATABASE IF EXISTS "${dbname}"`);

    console.log(`Database "${dbname}" droped successfully...`);
  } catch (error) {
    console.error("Error droping database:", error);
  } finally {
    await client.end();
  }
}
