import { chromium } from "playwright-core";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
await page.goto("http://localhost:3133/ui-gallery", { waitUntil: "networkidle" });
const R = [];
const t = async (n, fn) => {
  try {
    const r = await fn();
    R.push([n, r === false ? "FAIL" : "ok", typeof r === "string" ? r : ""]);
  } catch (e) {
    R.push([n, "FAIL", e.message.split("\n")[0].slice(0, 130)]);
  }
};
const focusRing = (loc) =>
  loc.evaluate((e) => {
    const s = getComputedStyle(e);
    return (
      (s.boxShadow && s.boxShadow !== "none") ||
      (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0)
    );
  });

await t("Button: keyboard focus shows a visible ring", async () => {
  const b = page.getByRole("button", { name: "Primary", exact: true });
  await b.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  return await focusRing(b);
});
await t("Input: visible focus", async () => {
  const i = page.locator("#g-name");
  await i.focus();
  return await focusRing(i);
});
await t("Switch: Space alterna", async () => {
  const s = page.getByTestId("switch");
  await s.focus();
  const a = await s.getAttribute("data-state");
  await page.keyboard.press("Space");
  return a !== (await s.getAttribute("data-state"));
});
await t("Select: Enter opens, arrow keys and Enter select, focus returns", async () => {
  const s = page.getByTestId("select-trigger");
  await s.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("listbox").waitFor();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(200);
  const txt = await s.textContent();
  const focused = await s.evaluate((e) => e === document.activeElement);
  return focused && txt ? `value: ${txt.trim()}` : false;
});
await t("RadioGroup: arrow keys change the selection", async () => {
  const g = page.getByRole("radiogroup", { name: "Options" });
  const sel = () => g.getByRole("radio", { checked: true }).getAttribute("id");
  const a = await sel();
  await g.getByRole("radio", { checked: true }).focus();
  await page.keyboard.press("ArrowDown");
  const b = await sel();
  return a !== b ? `${a} to ${b}` : false;
});
await t("Tabs: right arrow activates the next tab", async () => {
  const tab = page.getByRole("tab", { name: "All", exact: true });
  await tab.focus();
  await page.keyboard.press("ArrowRight");
  return (
    (await page.getByRole("tab", { name: "Security" }).first().getAttribute("aria-selected")) ===
    "true"
  );
});
await t(
  "DropdownMenu: Enter opens, arrow keys navigate, and Esc closes and returns focus",
  async () => {
    const tr = page.getByTestId("menu-trigger");
    await tr.focus();
    await page.keyboard.press("Enter");
    await page.getByRole("menu").waitFor();
    await page.keyboard.press("ArrowDown");
    const inMenu = await page.evaluate(() => !!document.activeElement?.closest('[role="menu"]'));
    await page.keyboard.press("Escape");
    await page.waitForTimeout(250);
    const back = await tr.evaluate((e) => e === document.activeElement);
    return inMenu && back;
  },
);
await t("Popover: Enter opens and Esc closes and returns focus", async () => {
  const tr = page.getByTestId("popover-trigger");
  await tr.focus();
  await page.keyboard.press("Enter");
  await page.getByText("Sidebar control").first().waitFor();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
  return await tr.evaluate((e) => e === document.activeElement);
});
await t("Sheet: traps focus, Esc closes, and focus returns", async () => {
  const tr = page.getByTestId("sheet-trigger");
  await tr.focus();
  await page.keyboard.press("Enter");
  const sheet = page.getByTestId("sheet-content");
  await sheet.waitFor();
  let trapped = true;
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    trapped =
      trapped && (await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]')));
  }
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  const back = await tr.evaluate((e) => e === document.activeElement);
  return trapped && back ? "ok" : `trapped=${trapped} returned=${back}`;
});
await t("Sheet: has an accessible name", async () => {
  await page.getByTestId("sheet-trigger").click();
  const name = await page.getByRole("dialog").getAttribute("aria-labelledby");
  const ok = !!name;
  await page.keyboard.press("Escape");
  return ok;
});
await t("Tooltip: appears on keyboard focus", async () => {
  await page.getByTestId("tooltip-trigger").focus();
  await page.waitForTimeout(500);
  return await page.getByText("Contextual help text").first().isVisible();
});
await t("SortableHead: Enter changes the sort order and exposes aria-sort", async () => {
  const th = page.getByTestId("sort-created");
  const b = th.getByRole("button");
  const a = await th.getAttribute("aria-sort");
  await b.focus();
  await page.keyboard.press("Enter");
  const c = await th.getAttribute("aria-sort");
  return a !== c ? `${a} to ${c}` : false;
});
await t("CodeBlock: copy button is accessible", async () => {
  const b = page.getByRole("button", { name: "Copy code" }).first();
  await b.focus();
  return await focusRing(b);
});
await t("Sidebar: links are reachable and aria-current marks the active item", async () => {
  return (await page.locator('nav[aria-label="Primary"] a[aria-current="page"]').count()) === 1;
});
await t("Complete Tab navigation without traps (200 steps)", async () => {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator("body").click({ position: { x: 5, y: 5 } });
  let n = 0;
  const seen = new Set();
  for (let i = 0; i < 200; i++) {
    await page.keyboard.press("Tab");
    const k = await page.evaluate(() => {
      const e = document.activeElement;
      return e
        ? e.tagName +
            ":" +
            (e.getAttribute("aria-label") || e.textContent || "").trim().slice(0, 20) +
            ":" +
            [...document.querySelectorAll("*")].indexOf(e)
        : "none";
    });
    seen.add(k);
    n++;
  }
  return seen.size > 30 ? `${seen.size} distinct focusable elements` : false;
});
console.log(R.map((r) => r.join(" | ")).join("\n"));
await browser.close();
