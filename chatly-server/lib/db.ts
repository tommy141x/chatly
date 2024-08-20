// db.js
import postgres from "postgres";

const env = process.env;

const sql = postgres({
  host: "timescaledb", // Postgres ip address[s] or domain name[s]
  port: 5432, // Postgres server port[s]
  database: "chatlydb", // Name of database to connect to
  username: "chatly", // Username of database user
  password: process.env.SECRET, // Password of database user
});

export default sql;
