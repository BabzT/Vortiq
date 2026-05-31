// knexfile.ts
import type { Knex } from "knex";
import "dotenv/config";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432"),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    pool: { min: 2, max: 10 },
    migrations: {
      directory: "./src/db/migrations",
      tableName: "knex_migrations",
      loadExtensions: [".ts"],
    },
    seeds: {
      directory: "./src/db/seeds",
      loadExtensions: [".ts"],
    },
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: { min: 2, max: 10 },
    migrations: {
      directory: "./dist/db/migrations",
      tableName: "knex_migrations",
      loadExtensions: [".ts"],
    },
    seeds: {
      directory: "./dist/db/seeds",
      loadExtensions: [".ts"],
    },
  },
};

export default config;
