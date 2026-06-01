import fs from "fs";
import path from "path";
import { renderEmail } from "./renderer";

const html = renderEmail("forgot-password", {
  subject: "Reset Your Password",
  firstName: "Alex",
  email: "alex@example.com",
  resetCode: "482917",
  expiresIn: "5 minutes",
});

const outPath = path.join(__dirname, "preview.html");
fs.writeFileSync(outPath, html, "utf8");
console.log(`Preview written to: ${outPath}`);
