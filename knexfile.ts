// knexfile.ts
import type { Knex } from "knex";
import "dotenv/config";
import { appConfig } from "./src/config/index";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: appConfig.DB_HOST,
      port: parseInt(appConfig.DB_PORT),
      user: appConfig.DB_USER,
      password: appConfig.DB_PASSWORD,
      database: appConfig.DB_NAME,
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
    connection: "",
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
