import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("brands").del();

  // Inserts seed entries
  await knex("brands").insert([
    { name: "Apple", slug: "apple" },
    { name: "Samsung", slug: "samsung" },
    { name: "Google", slug: "google" },
    { name: "Tecno", slug: "tecno" },
    { name: "Infinix", slug: "infinix" },
  ]);
}
