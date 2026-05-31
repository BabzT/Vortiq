import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("fullname").notNullable();
    table.string("email").notNullable().unique();
    table.string("phone").nullable().unique();
    table.string("password").notNullable();
    table.boolean("is_verified").defaultTo(false);
    table.boolean("is_active").defaultTo(false);
    table.string("auth_provider").defaultTo("email");
    table.string("provider_user_id").nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
