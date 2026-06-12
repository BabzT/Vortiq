import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("order_items", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("order_id")
      .notNullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table
      .uuid("product_id")
      .notNullable()
      .references("id")
      .inTable("products")
      .onDelete("RESTRICT");
    table.string("product_name").notNullable();
    table.decimal("product_price", 10, 2).notNullable();
    table.jsonb("product_cover_image").notNullable();
    table.jsonb("product_other_images").nullable();
    table.integer("quantity").notNullable();
    table.decimal("subtotal", 10, 2).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("order_items");
}

