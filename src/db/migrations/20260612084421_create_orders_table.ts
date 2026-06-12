import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("orders", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("order_number").notNullable().unique()
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("RESTRICT");
    table.decimal("total_amount", 10, 2).notNullable();
    table.jsonb("shipping_address").notNullable();
    table.string("order_status", 20).notNullable().defaultTo("processing");
    table.string("payment_status", 20).notNullable().defaultTo("paid");
    table.string("payment_reference", 255).notNullable().unique();
    table.text('note').nullable()
    table.timestamps(true, true);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("orders");
}

