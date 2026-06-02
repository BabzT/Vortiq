import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("categories").del();

  // Inserts seed entries
  await knex("categories").insert([
    { name: "Phones", slug: "phones" },
    { name: "Tablets", slug: "tablets" },
    { name: "Laptops", slug: "laptops" },
    { name: "Wearables", slug: "wearables" },
    { name: "Accessories", slug: "accessories" },
  ]);
}
