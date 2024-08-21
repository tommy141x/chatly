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
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        display_name VARCHAR(255) NOT NULL,
        bio TEXT,
        avatar VARCHAR(255),
        banner VARCHAR(255),
        status VARCHAR(255),
        activity_status JSONB,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        connections JSONB,
        message_settings JSONB,
        notifications JSONB,
        blocked_users UUID[],
        join_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        language VARCHAR(10),
        servers JSONB,
        groups JSONB,
        sessions JSONB
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS relationships (
        id SERIAL PRIMARY KEY,
        follower_id UUID REFERENCES users(id),
        followed_id UUID REFERENCES users(id)
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        tags TEXT[],
        author_id UUID REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS servers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        bio TEXT,
        banner VARCHAR(255),
        key_id VARCHAR(255) UNIQUE NOT NULL,
        icon VARCHAR(255),
        owner_id UUID REFERENCES users(id),
        members JSONB,
        categories JSONB,
        channels JSONB,
        roles JSONB
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS group_dms (
        id SERIAL PRIMARY KEY,
        members UUID[],
        name VARCHAR(255),
        owner_id UUID REFERENCES users(id),
        icon VARCHAR(255)
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS dms (
        id SERIAL PRIMARY KEY,
        members UUID[],
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        author_id UUID REFERENCES users(id),
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        reactions JSONB,
        attachments JSONB,
        mentions UUID[],
        location_id UUID
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
