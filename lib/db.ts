import { Pool } from "pg";

let pool: Pool;

declare global {
  // Allow global `pool` reuse across hot reloads
  var pgPool: Pool | undefined;
}

if (!global.pgPool) {
  global.pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })
}

pool = global.pgPool;
if (pool) {
  pool
    .on("connect", () => {
      console.log("Connected to Postgres");
    })
    .on("error", (err) => {
      console.error("Unexpected error on idle client", err);
    });
}

export default pool;