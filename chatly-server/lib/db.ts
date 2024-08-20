// db.js
import postgres from "postgres";

const sql = postgres({
  host: "timescaledb", // Postgres ip address[s] or domain name[s]
  port: 5432, // Postgres server port[s]
  database: "chatlydb", // Name of database to connect to
  username: "chatly", // Username of database user
  password: process.env.API_SECRET, // Password of database user
});

async function query(query, params = []) {
  try {
    // If query is already an SQL query object, execute it directly
    if (typeof query === "function") {
      return await query(...params);
    }
    // Otherwise, use sql.unsafe
    const result = await sql.unsafe(query, params);
    return result;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

async function initDB() {
  // Create the database table if it does not exist
  await sql`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`
    CREATE TABLE sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      token VARCHAR(64) UNIQUE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log("Tables created successfully.");
}

async function wipeDB() {
  try {
    // Retrieve all table names
    const result = await query(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`,
    );

    // Drop each table individually
    for (const row of result) {
      await sql`DROP TABLE IF EXISTS ${sql(row.tablename)} CASCADE`;
    }

    console.log("All tables dropped successfully.");
  } catch (error) {
    console.error("Error dropping tables:", error);
    throw error;
  }
}

async function softWipeDB() {
  // Delete non essential tables
}

export { sql, query, initDB, wipeDB, softWipeDB };
