import knex from "knex";

const dbConfig = require("../../knexfile").default;
const environment = process.env.NODE_ENV || "development";
const configOptions = dbConfig[environment];
const db = knex(configOptions);

export default db;
