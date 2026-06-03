import type { Knex } from "knex";
import { generateSku, generateSlug } from "../../helpers/generate";

const S3 =
  "https://vortiq-500870441154-eu-north-1-an.s3.eu-north-1.amazonaws.com";

const BRANDS: Record<string, string> = {};
const CATEGORIES: Record<string, string> = {};

const IMAGES = [
  {
    key: "ddb746ff-4808-4af5-a5c7-690eb3c33fb8.webp",
    name: "Openbook mac.webp",
    url: `${S3}/ddb746ff-4808-4af5-a5c7-690eb3c33fb8.webp`,
  },
  {
    key: "c58af542-3f36-4d92-9643-91c1e07d62cb.webp",
    name: "Macbook air m5.webp",
    url: `${S3}/c58af542-3f36-4d92-9643-91c1e07d62cb.webp`,
  },
  {
    key: "9c0942a4-4bd8-4193-86cf-1f48c061f895.webp",
    name: "Macbook pro m4.webp",
    url: `${S3}/9c0942a4-4bd8-4193-86cf-1f48c061f895.webp`,
  },
  {
    key: "40b83f1a-c4f4-465d-9193-641e45476bdf.webp",
    name: "Used 16 promax.webp",
    url: `${S3}/40b83f1a-c4f4-465d-9193-641e45476bdf.webp`,
  },
  {
    key: "794982db-a8c5-4bde-8b3d-653e519b9fa0.webp",
    name: "Lock 17.webp",
    url: `${S3}/794982db-a8c5-4bde-8b3d-653e519b9fa0.webp`,
  },
  {
    key: "1f45e11f-c7c2-4f84-aaf4-2e487d58e30f.webp",
    name: "Infinix Hot 15.webp",
    url: `${S3}/1f45e11f-c7c2-4f84-aaf4-2e487d58e30f.webp`,
  },
  {
    key: "a24a9364-09b9-4388-a026-5798a235dd5f.webp",
    name: "Locked 16.webp",
    url: `${S3}/a24a9364-09b9-4388-a026-5798a235dd5f.webp`,
  },
  {
    key: "a8de18b7-f184-480f-8cca-16359fa0e74e.webp",
    name: "Uk 17promax.webp",
    url: `${S3}/a8de18b7-f184-480f-8cca-16359fa0e74e.webp`,
  },
  {
    key: "43322168-f29d-435d-b292-8dbd1d41be5d.webp",
    name: "Mackbook pro m5.webp",
    url: `${S3}/43322168-f29d-435d-b292-8dbd1d41be5d.webp`,
  },
  {
    key: "de3400e8-7c5a-448c-97e7-4c47c2050f83.webp",
    name: "Orange 17 promax.webp",
    url: `${S3}/de3400e8-7c5a-448c-97e7-4c47c2050f83.webp`,
  },
  {
    key: "c4951232-93b0-4c28-9490-dceaf3c50a34.webp",
    name: "Lock 17pro.webp",
    url: `${S3}/c4951232-93b0-4c28-9490-dceaf3c50a34.webp`,
  },
  {
    key: "dad9d4c2-db8b-491b-a6f6-54d19b0423e8.webp",
    name: "Uk 16 promax.webp",
    url: `${S3}/dad9d4c2-db8b-491b-a6f6-54d19b0423e8.webp`,
  },
  {
    key: "d7e16d4d-c078-4726-965a-9894446a84d2.webp",
    name: "Used 17 air.webp",
    url: `${S3}/d7e16d4d-c078-4726-965a-9894446a84d2.webp`,
  },
  {
    key: "643e14b2-4574-4108-94c2-675ae1967437.webp",
    name: "Bulk 16.webp",
    url: `${S3}/643e14b2-4574-4108-94c2-675ae1967437.webp`,
  },
  {
    key: "1563d31f-266e-426c-bb30-7117c83a5d17.webp",
    name: "Bulk 17promax.webp",
    url: `${S3}/1563d31f-266e-426c-bb30-7117c83a5d17.webp`,
  },
  {
    key: "9a4bfdd2-8e79-42fc-a37c-87c0300e72c0.webp",
    name: "iphone 12 used.webp",
    url: `${S3}/9a4bfdd2-8e79-42fc-a37c-87c0300e72c0.webp`,
  },
  {
    key: "2352a314-3a21-4698-bc18-1aa723516439.webp",
    name: "iphone 14pro.webp",
    url: `${S3}/2352a314-3a21-4698-bc18-1aa723516439.webp`,
  },
  {
    key: "b879a851-f595-4dd9-b4e5-1d5f6594c409.webp",
    name: "iphone 14 blue.webp",
    url: `${S3}/b879a851-f595-4dd9-b4e5-1d5f6594c409.webp`,
  },
  {
    key: "58c7135c-83f2-4f7b-8caa-ed09f42163d2.webp",
    name: "google pixel 8.webp",
    url: `${S3}/58c7135c-83f2-4f7b-8caa-ed09f42163d2.webp`,
  },
  {
    key: "c4e98565-00d0-444d-b341-e77268a49f20.webp",
    name: "ipad m4.webp",
    url: `${S3}/c4e98565-00d0-444d-b341-e77268a49f20.webp`,
  },
  {
    key: "7d00de11-e7bf-44fa-92eb-7389765f0a05.webp",
    name: "airpod max 2.webp",
    url: `${S3}/7d00de11-e7bf-44fa-92eb-7389765f0a05.webp`,
  },
  {
    key: "cf554479-16c5-4adc-9240-bd4f33ed5295.webp",
    name: "starlink.webp",
    url: `${S3}/cf554479-16c5-4adc-9240-bd4f33ed5295.webp`,
  },
  {
    key: "b6dd61aa-53c8-4c24-a072-6a4d6ab535be.webp",
    name: "iWatch Series 6.webp",
    url: `${S3}/b6dd61aa-53c8-4c24-a072-6a4d6ab535be.webp`,
  },
  {
    key: "b78692f0-b21e-4136-b099-933cda041146.webp",
    name: "Tecno pop 8.webp",
    url: `${S3}/b78692f0-b21e-4136-b099-933cda041146.webp`,
  },
  {
    key: "bd788fd0-a674-4d15-b7e2-fe38bcbaab86.webp",
    name: "iphone air bulk.webp",
    url: `${S3}/bd788fd0-a674-4d15-b7e2-fe38bcbaab86.webp`,
  },
  {
    key: "10251fd0-57e2-4966-9773-37d6a817ec9a.webp",
    name: "Silver 17 pro max.webp",
    url: `${S3}/10251fd0-57e2-4966-9773-37d6a817ec9a.webp`,
  },
  {
    key: "5f984eba-4685-4945-b907-b1fd971001b3.webp",
    name: "iphone 17promax.webp",
    url: `${S3}/5f984eba-4685-4945-b907-b1fd971001b3.webp`,
  },
  {
    key: "ae8d5253-ab8b-4117-898e-8864fa4f5e22.webp",
    name: "iphone 16.webp",
    url: `${S3}/ae8d5253-ab8b-4117-898e-8864fa4f5e22.webp`,
  },
  {
    key: "e18b9bbc-ce53-4e7c-bcfa-4c737a24206a.webp",
    name: "iphone 17 pro.webp",
    url: `${S3}/e18b9bbc-ce53-4e7c-bcfa-4c737a24206a.webp`,
  },
  {
    key: "a7c1eb67-3527-4426-af27-4abd882145c0.webp",
    name: "iphone air.webp",
    url: `${S3}/a7c1eb67-3527-4426-af27-4abd882145c0.webp`,
  },
  {
    key: "223f6dd3-0e1e-4202-83ae-4cd6ece47db8.webp",
    name: "iphone 12.webp",
    url: `${S3}/223f6dd3-0e1e-4202-83ae-4cd6ece47db8.webp`,
  },
  {
    key: "29c65a33-a844-414c-b7c8-46b382e07668.webp",
    name: "iphone 13pro.webp",
    url: `${S3}/29c65a33-a844-414c-b7c8-46b382e07668.webp`,
  },
  {
    key: "96afb2b3-da4c-490e-8155-bdbc92a389b0.webp",
    name: "iphone 15pro.webp",
    url: `${S3}/96afb2b3-da4c-490e-8155-bdbc92a389b0.webp`,
  },
  {
    key: "669bd0d5-816c-4040-b278-6abddb0c8aeb.webp",
    name: "samsung s25.webp",
    url: `${S3}/669bd0d5-816c-4040-b278-6abddb0c8aeb.webp`,
  },
  {
    key: "04047b7f-69e5-4ca9-9a42-b710f10b4a72.webp",
    name: "White iphone 13.webp",
    url: `${S3}/04047b7f-69e5-4ca9-9a42-b710f10b4a72.webp`,
  },
  {
    key: "d5040f74-18c8-4afe-9509-4d7454cdd8c6.webp",
    name: "Samsung s24.webp",
    url: `${S3}/d5040f74-18c8-4afe-9509-4d7454cdd8c6.webp`,
  },
  {
    key: "e34265b6-cfc8-45ee-9db2-4ee3d2702412.webp",
    name: "adapter.webp",
    url: `${S3}/e34265b6-cfc8-45ee-9db2-4ee3d2702412.webp`,
  },
  {
    key: "416bbfa8-1457-49d6-a820-afee5e1b1b17.webp",
    name: "iphone 15.webp",
    url: `${S3}/416bbfa8-1457-49d6-a820-afee5e1b1b17.webp`,
  },
  {
    key: "d96f5393-c670-40a9-ba5d-a5745878ba3d.webp",
    name: "iphone 14promax.webp",
    url: `${S3}/d96f5393-c670-40a9-ba5d-a5745878ba3d.webp`,
  },
  {
    key: "1d636824-3aba-4554-8415-bd57d5b2c1cc.webp",
    name: "iphone 14.webp",
    url: `${S3}/1d636824-3aba-4554-8415-bd57d5b2c1cc.webp`,
  },
  {
    key: "989c0e65-483f-4c63-a226-0a48515983f0.webp",
    name: "airpod max.webp",
    url: `${S3}/989c0e65-483f-4c63-a226-0a48515983f0.webp`,
  },
  {
    key: "b07a4a0a-4874-4bef-ac35-cf32afba7502.webp",
    name: "dj osmo.webp",
    url: `${S3}/b07a4a0a-4874-4bef-ac35-cf32afba7502.webp`,
  },
  {
    key: "0e88807a-6cd5-4838-8056-b65d50489da2.webp",
    name: "lark.webp",
    url: `${S3}/0e88807a-6cd5-4838-8056-b65d50489da2.webp`,
  },
  {
    key: "c8878717-aa54-4650-9034-6dc7e66be7bb.webp",
    name: "airpod.webp",
    url: `${S3}/c8878717-aa54-4650-9034-6dc7e66be7bb.webp`,
  },
];


const STORAGES = ["64GB", "128GB", "256GB", "512GB", "1TB"];
const COLORS = [
  "Black",
  "White",
  "Silver",
  "Gold",
  "Blue",
  "Purple",
  "Red",
  "Titanium",
];
const CONDITIONS = ["Brand New", "UK Used", "Nigerian Used", "Refurbished"];

const rand = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

export async function seed(knex: Knex): Promise<void> {
  await knex("products").del();

  // Fetch real IDs from DB
  const brands = await knex("brands").select("id", "slug");
  const categories = await knex("categories").select("id", "slug");

  for (const b of brands) BRANDS[b.slug] = b.id;
  for (const c of categories) CATEGORIES[c.slug] = c.id;

  const TEMPLATES = [
    { baseName: "iPhone 17 Pro Max", brand_id: BRANDS.apple, category_id: CATEGORIES.phones, cost: 950, price: 1150, stock: 25 },
    { baseName: "iPhone 17 Pro", brand_id: BRANDS.apple, category_id: CATEGORIES.phones, cost: 850, price: 1050, stock: 30 },
    { baseName: "iPhone 17 Air", brand_id: BRANDS.apple, category_id: CATEGORIES.phones, cost: 750, price: 950, stock: 35 },
    { baseName: "iPhone 16 Pro Max", brand_id: BRANDS.apple, category_id: CATEGORIES.phones, cost: 700, price: 900, stock: 40 },
    { baseName: "iPhone 16 Pro", brand_id: BRANDS.apple, category_id: CATEGORIES.phones, cost: 620, price: 820, stock: 45 },
    { baseName: "iPhone 16", brand_id: BRANDS.apple, category_id: CATEGORIES.phones, cost: 520, price: 720, stock: 50 },
    { baseName: "iPhone 15 Pro", brand_id: BRANDS.apple, category_id: CATEGORIES.phones, cost: 480, price: 660, stock: 60 },
    { baseName: "iPhone 15", brand_id: BRANDS.apple, category_id: CATEGORIES.phones, cost: 400, price: 560, stock: 70 },
    { baseName: "iPhone 14 Pro Max", brand_id: BRANDS.apple, category_id: CATEGORIES.phones, cost: 460, price: 640, stock: 55 },
    { baseName: "iPhone 14 Pro", brand_id: BRANDS.apple, category_id: CATEGORIES.phones, cost: 400, price: 570, stock: 60 },
    { baseName: "iPhone 14", brand_id: BRANDS.apple, category_id: CATEGORIES.phones, cost: 340, price: 490, stock: 75 },
    { baseName: "iPhone 13 Pro", brand_id: BRANDS.apple, category_id: CATEGORIES.phones, cost: 340, price: 470, stock: 80 },
    { baseName: "iPhone 13", brand_id: BRANDS.apple, category_id: CATEGORIES.phones, cost: 280, price: 400, stock: 90 },
    { baseName: "iPhone 12", brand_id: BRANDS.apple, category_id: CATEGORIES.phones, cost: 200, price: 300, stock: 100 },
    { baseName: "MacBook Pro M4", brand_id: BRANDS.apple, category_id: CATEGORIES.laptops, cost: 1400, price: 1800, stock: 15 },
    { baseName: "MacBook Air M5", brand_id: BRANDS.apple, category_id: CATEGORIES.laptops, cost: 1100, price: 1400, stock: 20 },
    { baseName: "iPad M4", brand_id: BRANDS.apple, category_id: CATEGORIES.tablets, cost: 600, price: 800, stock: 30 },
    { baseName: "AirPods Max 2", brand_id: BRANDS.apple, category_id: CATEGORIES.accessories, cost: 420, price: 580, stock: 40 },
    { baseName: "AirPods Pro", brand_id: BRANDS.apple, category_id: CATEGORIES.accessories, cost: 140, price: 210, stock: 80 },
    { baseName: "Apple Watch Series 6", brand_id: BRANDS.apple, category_id: CATEGORIES.wearables, cost: 180, price: 280, stock: 60 },
    { baseName: "Samsung Galaxy S25", brand_id: BRANDS.samsung, category_id: CATEGORIES.phones, cost: 720, price: 920, stock: 40 },
    { baseName: "Samsung Galaxy S24", brand_id: BRANDS.samsung, category_id: CATEGORIES.phones, cost: 560, price: 740, stock: 50 },
    { baseName: "Google Pixel 8", brand_id: BRANDS.google, category_id: CATEGORIES.phones, cost: 460, price: 640, stock: 45 },
    { baseName: "Tecno Pop 8", brand_id: BRANDS.tecno, category_id: CATEGORIES.phones, cost: 70, price: 110, stock: 150 },
    { baseName: "Infinix Hot 15", brand_id: BRANDS.infinix, category_id: CATEGORIES.phones, cost: 80, price: 130, stock: 130 },
  ];

  const products: any[] = [];
  const seen = new Set<string>();

  outer: for (const template of TEMPLATES) {
    for (const storage of STORAGES) {
      for (const color of COLORS) {
        for (const condition of CONDITIONS) {
          if (products.length >= 500) break outer;

          const name = `${template.baseName} ${storage} ${color} - ${condition}`;
          if (seen.has(name)) continue;
          seen.add(name);

          const cover = rand(IMAGES);

          const hasOtherImages = Math.random() < 0.3;
          const other_images = hasOtherImages
            ? JSON.stringify(
                Array.from({ length: Math.floor(Math.random() * 3) + 2 }, () =>
                  rand(IMAGES),
                ),
              )
            : null;

          const is_active = Math.random() > 0.15;

          products.push({
            name,
            slug: generateSlug(name),
            description: `${name}. Premium quality gadget available at Vortiq.`,
            cost: template.cost,
            price: template.price,
            sku: generateSku(),
            stock: template.stock,
            category_id: template.category_id,
            brand_id: template.brand_id,
            cover_image: JSON.stringify(cover),
            other_images,
            is_active,
          });
        }
      }
    }
  }

  await knex("products").insert(products);
  console.log(`Inserted ${products.length} products`);
}
