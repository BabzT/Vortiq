import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

const HBS_DIR = path.join(__dirname, "hbs");

const layout = Handlebars.compile(
  fs.readFileSync(path.join(HBS_DIR, "layout.hbs"), "utf8")
);

export function renderEmail(
  templateName: string,
  data: Record<string, unknown>
): string {
  const templateSrc = fs.readFileSync(
    path.join(HBS_DIR, `${templateName}.hbs`),
    "utf8"
  );
  const body = Handlebars.compile(templateSrc)(data);

  return layout({
    brandName: "Vortiq",
    year: new Date().getFullYear(),
    subject: data.subject ?? "Email",
    ...data,
    body,
  });
}
