import { chromium } from "playwright-core";
const out = process.argv[2];
const browser = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1500, height: 772 },
  deviceScaleFactor: 2,
});
const rect = (page, sel, nth = 0) =>
  page
    .locator(sel)
    .nth(nth)
    .evaluate((e) => {
      const r = e.getBoundingClientRect();
      return {
        x: +r.x.toFixed(1),
        y: +r.y.toFixed(1),
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
      };
    });
const res = {};
for (const id of ["s01", "s05", "s06", "s14", "s15"]) {
  const page = await ctx.newPage();
  const logs = [];
  page.on(
    "console",
    (m) => ["error", "warning"].includes(m.type()) && logs.push(m.text().slice(0, 200)),
  );
  page.on("pageerror", (e) => logs.push(e.message.slice(0, 200)));
  await page.goto(`http://localhost:3133/ui-gallery/${id}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/mine-${id}.png` });
  const m = { logs };
  m.topbar = await rect(page, "header");
  if (id !== "s01") {
    m.sidebar = await rect(page, 'nav[aria-label="Primary"]');
    m.subnav = await rect(page, 'nav[aria-label="Section"]');
    const items = page.locator('nav[aria-label="Primary"] a');
    const a = await items.nth(0).boundingBox(),
      b = await items.nth(1).boundingBox();
    m.sidebarItem = { h: a.height, pitch: +(b.y - a.y).toFixed(1) };
  }
  if (id === "s05" || id === "s06") {
    const t = page.locator('main [class*="rounded-md"][class*="shadow-sm"]');
    const t0 = await t.nth(0).boundingBox(),
      t3 = await t.nth(3).boundingBox();
    m.statTile = { h: t0.height, rowGap: +(t3.y - (t0.y + t0.height)).toFixed(1) };
    m.refreshBtn = await rect(page, 'button:has-text("Refresh")');
  }
  if (id === "s15") {
    m.tableHeader = await rect(page, "thead th", 0);
    const r0 = await page.locator("tbody tr").nth(0).boundingBox(),
      r1 = await page.locator("tbody tr").nth(1).boundingBox();
    m.row = { h: r0.height, pitch: +(r1.y - r0.y).toFixed(1) };
  }
  if (id === "s01") {
    m.input = await rect(page, "#s01-name");
    m.applyBtn = await rect(page, 'button:has-text("Apply filters")');
    const r0 = await page.locator("tbody tr").nth(0).boundingBox(),
      r1 = await page.locator("tbody tr").nth(1).boundingBox();
    m.row = { h: r0.height, pitch: +(r1.y - r0.y).toFixed(1) };
  }
  res[id] = m;
  await page.close();
}
console.log(JSON.stringify(res, null, 1));
await browser.close();
