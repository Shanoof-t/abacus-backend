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
    logUpdate(`${frame} Running migrations...`);
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

async function createEnums() {
  let currentFile = "";
  const createdEnums: string[] = [];

  try {
    const location = path.join(__dirname, "enums");
    const files = await readdir(location);

    for (let x of files) {
      currentFile = x;
      if (
        x.includes("create") &&
        x.includes("enum") &&
        path.extname(x) === ".sql"
      ) {
        const filePath = path.join(location, x);
        const content = await readFile(filePath, { encoding: "utf-8" });
        await sleep(150);
        await pool.query(content);

        // Extract enum name from filename
        const enumName = x
          .replace(/^create[-_]?/i, "")
          .replace(/[-_]?enum\.sql$/i, "");
        createdEnums.push(enumName);
      }
    }

    if (createdEnums.length > 0) {
      logUpdate.clear();
      // console.log("✔".green + " Created database enums");
      // createdEnums.forEach((enumName) => {
      //   console.log(`  - ${enumName}_enum`.gray);
      // });
      // console.log();
    }

    return createdEnums;
  } catch (error: any) {
    // If enums directory doesn't exist, that's okay
    if (error.code === 'ENOENT') {
      return [];
    }
    
    logUpdate.clear();
    console.log("❌ Enum creation failed\n".red);
    console.log("Error in enum file:".red, currentFile.yellow);
    console.log("Database error:".red, error.message.yellow);
    console.log("\nPlease fix the error and try again.".red);
    process.exit(1);
  }
}

async function createTables() {
  let currentFile = "";
  const migratedTables: string[] = [];

  try {
    const location = path.join(__dirname, "tables");
    const files = await readdir(location);

    for (let x of files) {
      currentFile = x;
      if (
        x.includes("create") &&
        x.includes("table") &&
        path.extname(x) === ".sql"
      ) {
        const filePath = path.join(location, x);
        const content = await readFile(filePath, { encoding: "utf-8" });
        await sleep(150);
        await pool.query(content);

        // Extract table name from filename or SQL content
        const tableName = x
          .replace(/^create[-_]?/i, "")
          .replace(/[-_]?table\.sql$/i, "");
        migratedTables.push(tableName);
      }
    }

    return migratedTables;
  } catch (error: any) {
    logUpdate.clear();

    // Prisma-style error logs
    console.log("❌ Migration failed\n".red);
    console.log("Error in migration file:".red, currentFile.yellow);
    console.log("Database error:".red, error.message.yellow);
    console.log("\nPlease fix the error and try again.".red);

    process.exit(1);
  }
}

async function run() {
  console.log("Starting database migration...\n".blue);

  const id = spinner();
  
  // Create enums first (tables might depend on them)
  const createdEnums = await createEnums();
  
  // Then create tables
  const migratedTables = await createTables();

  clearInterval(id);
  logUpdate.clear();

  // Final success summary
  console.log("Migration completed successfully! 🎉\n");

  if (createdEnums.length > 0 || migratedTables.length > 0) {
    console.log("The following migration(s) have been applied:\n");

    // Show enums section if any exist
    if (createdEnums.length > 0) {
      console.log("migrations/enums".blue);
      createdEnums.forEach((enumName) => {
        console.log(`  └─ create_${enumName}_enum.sql`.green);
      });
      console.log();
    }

    // Show tables section if any exist
    if (migratedTables.length > 0) {
      console.log("migrations/tables".blue);
      migratedTables.forEach((tableName) => {
        console.log(`  └─ create_${tableName}_table.sql`.green);
      });
      console.log();
    }
  }

  // Summary checkmarks
  if (createdEnums.length > 0) {
    console.log("✔".green + ` Created ${createdEnums.length} enum${createdEnums.length !== 1 ? "s" : ""}`);
  }
  
  if (migratedTables.length > 0) {
    console.log("✔".green + " Generated database tables");
    console.log(
      "✔".green +
        ` Applied ${migratedTables.length} table migration${
          migratedTables.length !== 1 ? "s" : ""
        }`
    );
  }

  console.log("✔".green + " Database schema is now in sync");
  console.log("\n" + "Your database is now up to date!".green);

  await pool.end();
}

run();