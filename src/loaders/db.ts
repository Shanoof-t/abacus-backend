import pg from "pg";
import env from "../config/env_variables";

const poolConfig: pg.PoolConfig = {
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  port: env.DB_PORT,
  database: env.DB_NAME,
};

const pool = new pg.Pool(poolConfig);

pool.on("connect", (client) => {
  // console.log("db client connected,", client);
});

export const query = async (queryText: string, params?: any[]) => {
  const startTime = Date.now();
  try {
    
    const res = await pool.query(queryText, params);
    const duration = Date.now() - startTime;

    console.log("QUERY EXICUTED:", {
      query: queryText,
      duration,
      rows: res.rowCount,
    });
    return res;
  } catch (error: any) {
    const err = {
      query: queryText,
      error: error.message,
    };
    console.error("QUERY FAILED:", err);
    throw err;
  }
};

export const getClient = () => {
  return pool.connect();
};
