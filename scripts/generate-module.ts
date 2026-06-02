import fs from "fs";
import path from "path";

const name = process.argv[2];

if (!name) {
  console.error("Usage: ts-node scripts/generate-module.ts <module-name>");
  process.exit(1);
}

const Name = name.charAt(0).toUpperCase() + name.slice(1);
const dir = path.join(__dirname, "..", "src", "modules", name);

if (fs.existsSync(dir)) {
  console.error(`Module "${name}" already exists at ${dir}`);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });

const files: Record<string, string> = {
  [`${name}.types.ts`]: `export interface Create${Name}Input {\n  // add fields here\n}\n`,

  [`${name}.validation.ts`]: `import { z } from "zod";\n\nexport const create${Name}Schema = z.object({\n  // add fields here\n});\n`,

  [`${name}.service.ts`]: `import db from "@/db";\nimport { ResponseType } from "@/types/response";\n\nexport const get${Name} = async (): Promise<ResponseType<any>> => {\n  const ${name} = await db("${name}").select("*").first();\n  return { error: false, data: ${name} };\n};\n`,

  [`${name}.controller.ts`]: `import { Request, Response } from "express";\nimport * as ${name}Service from "@/modules/${name}/${name}.service";\n\nexport const get${Name} = async (req: Request, res: Response) => {\n  try {\n    const result = await ${name}Service.get${Name}();\n    if (result.error) {\n      return res.status(result.statusCode).json({ error: result.message });\n    }\n    return res.status(200).json({ data: result.data });\n  } catch (error) {\n    console.error("Error fetching ${name}:", error);\n    return res.status(500).json({ error: "Internal server error" });\n  }\n};\n`,

  [`${name}.routes.ts`]: `import express from "express";\nimport * as ${name}Controller from "@/modules/${name}/${name}.controller";\n\nconst router = express.Router();\n\nrouter.get("/", ${name}Controller.get${Name});\n\nexport default router;\n`,
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, filename), content, "utf8");
  console.log(`  created: src/modules/${name}/${filename}`);
}

console.log(`\nModule "${name}" generated successfully.`);
console.log(`Next: mount the router in src/routes/index.ts`);
