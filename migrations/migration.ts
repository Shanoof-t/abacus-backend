import "dotenv/config";
import "colors";
import { readdir, readFile } from "node:fs/promises";
import path from "path";
import pg from "pg";
import logUpdate from "log-update";

function spinner() {
  let frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

  let i = 0;
  const id = setInterval(() => {
    const frame = frames[i++ % frames.length];
    logUpdate(`${frame} Migrating...`);
  }, 100);
  return id;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const poolConfig: pg.PoolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
};

const pool = new pg.Pool(poolConfig);

async function createTables() {
  try {
    const files = await readdir(__dirname);
    let fileNames: string[] = [];

    for (let x of files) {
      if (
        x.includes("create") &&
        x.includes("table") &&
        path.extname(x) === ".sql"
      ) {
        const filePath = path.join(__dirname, x);
        const content = await readFile(filePath, { encoding: "utf-8" });
        await sleep(150);
        await pool.query(content);
        fileNames.push(x);
      }
    }
    logUpdate.clear();
    console.log(fileNames.join(", ").green + " created".green);
  } catch (error: any) {
    console.log(`error in table migration: ${error.message}`.red);
  }
}

async function run() {
  const id = spinner();
  await createTables();

  clearInterval(id);
}

run();
