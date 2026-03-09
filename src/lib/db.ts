import mysql from "mysql2/promise";

const pool = mysql.createPool({
  database: process.env.DB_NAME || "global-ecc",
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  ...(process.env.ENV === "GCR"
    ? { socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION}` }
    : { host: process.env.DB_HOST || "127.0.0.1" }),
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 2,
  idleTimeout: 60000,
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 30000,
  dateStrings: true,
  typeCast: function (field, next) {
    if (
      field.type === "DECIMAL" ||
      field.type === "NEWDECIMAL" ||
      field.type === "LONGLONG"
    ) {
      const val = field.string();
      return val === null ? null : Number(val);
    }
    return next();
  },
});

export async function query<T>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

// Graceful shutdown: close pool connections when the process exits
// (prevents orphaned MySQL sessions that block DDL operations)
function gracefulShutdown() {
  pool.end().catch(() => {});
}
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

export default pool;
