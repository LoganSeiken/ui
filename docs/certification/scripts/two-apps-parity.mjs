// Compares the component gallery rendered by two apps that consume @loganseiken/ui.
// Usage: node two-apps-parity.mjs [urlA] [urlB] [outDir]
import { chromium } from "playwright-core";

const [
  urlA = "http://localhost:3133/ui-gallery",
  urlB = "http://localhost:3134/ui-gallery",
  out = ".",
] = process.argv.slice(2);
const props = [
  "color",
  "backgroundColor",
  "borderTopColor",
  "borderTopWidth",
  "borderTopLeftRadius",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "paddingTop",
  "paddingLeft",
  "height",
  "boxShadow",
];

const browser = await chromium.launch({ channel: "chrome", headless: true });

async function snapshot(url, name) {
  const page = await browser.newPage({ viewport: { width: 1500, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/parity-${name}.png`, fullPage: true });
  const data = await page.evaluate((list) => {
    const root = document.querySelector('[data-testid="gallery-root"]');
    const nodes = [root, ...root.querySelectorAll("*")].filter(
      (el) => el.getBoundingClientRect().width > 0,
    );
    return {
      text: root.innerText,
      elements: nodes.map((el) => {
        const cs = getComputedStyle(el);
        return [el.tagName, cs.width, ...list.map((p) => cs[p])].join("|");
      }),
    };
  }, props);
  await page.close();
  return data;
}

const a = await snapshot(urlA, "a");
const b = await snapshot(urlB, "b");
await browser.close();

const total = Math.max(a.elements.length, b.elements.length);
let different = 0;
const samples = [];
for (let i = 0; i < total; i++) {
  if (a.elements[i] !== b.elements[i]) {
    different++;
    if (samples.length < 5) samples.push({ index: i, a: a.elements[i], b: b.elements[i] });
  }
}
console.log(`identical text: ${a.text === b.text}`);
console.log(`elementos comparados: ${total} (A=${a.elements.length}, B=${b.elements.length})`);
console.log(`elements with different styles or sizes: ${different}`);
if (samples.length) console.log(JSON.stringify(samples, null, 1));
process.exit(different === 0 && a.text === b.text ? 0 : 1);
