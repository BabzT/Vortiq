import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("cart_items", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("cart_id").notNullable().references('id').inTable("carts").onDelete("CASCADE");
    table.uuid("product_id").notNullable().references('id').inTable("products").onDelete("RESTRICT");
    table.integer("quantity").notNullable().defaultTo(1)
    table.unique(["cart_id", "product_id"])
    table.timestamps(true, true)
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("cart_items")
}

