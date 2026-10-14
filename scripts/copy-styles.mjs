import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync("dist", { recursive: true });
for (const file of ["tokens.css", "theme.css"]) {
  copyFileSync(`src/styles/${file}`, `dist/${file}`);
}
