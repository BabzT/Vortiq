import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("products", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("name").notNullable().unique();
    table.string("slug").notNullable().unique();
    table.text("description").nullable();
    table.decimal("cost", 10, 2).notNullable();
    table.decimal("price", 10, 2).notNullable();
    table.string("sku").notNullable().unique();
    table.integer("stock").notNullable();
    table
      .uuid("category_id")
      .notNullable()
      .references("id")
      .inTable("categories")
      .onDelete("RESTRICT");
    table
      .uuid("brand_id")
      .notNullable()
      .references("id")
      .inTable("brands")
      .onDelete("RESTRICT");
    table.jsonb("cover_image").notNullable();
    table.jsonb("other_images").nullable();
    table.boolean("is_active").defaultTo(true);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("products");
}
