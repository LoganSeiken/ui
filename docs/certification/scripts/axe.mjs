import { chromium } from "playwright-core";
import path from "node:path";
const axePath = path.resolve("node_modules/axe-core/axe.min.js");
const browser = await chromium.launch({ channel: "chrome", headless: true });
const targets = [
  ["light-gallery", "/ui-gallery", null],
  ["dark-gallery", "/ui-gallery", "dark"],
  ["s01", "/ui-gallery/s01", null], ["s05", "/ui-gallery/s05", null],
  ["s06 (sheet abierto)", "/ui-gallery/s06", null], ["s14", "/ui-gallery/s14", null], ["s15", "/ui-gallery/s15", null]
];
const summary = [];
for (const [name, url, theme] of targets) {
  const page = await browser.newPage({ viewport: { width: 1500, height: 900 } });
  await page.goto("http://localhost:3133" + url, { waitUntil: "networkidle" });
  if (theme) { await page.getByTestId("theme-toggle").click(); await page.waitForTimeout(600); }
  await page.addScriptTag({ path: axePath });
  const r = await page.evaluate(async () => await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } }));
  const v = r.violations.map(x => ({ id: x.id, impact: x.impact, n: x.nodes.length, help: x.help, sample: x.nodes.slice(0, 2).map(n => n.target.join(" ").slice(0, 90) + " :: " + (n.any[0]?.message || n.failureSummary || "").slice(0, 110)) }));
  summary.push({ name, violaciones: v.length, reglasPasadas: r.passes.length, v });
  await page.close();
}
for (const s of summary) {
  console.log(`\n== ${s.name}: ${s.violaciones} violaciones (${s.reglasPasadas} reglas pasadas)`);
  for (const x of s.v) { console.log(`  - [${x.impact}] ${x.id} x${x.n}: ${x.help}`); x.sample.forEach(t => console.log("      " + t)); }
}
await browser.close();
