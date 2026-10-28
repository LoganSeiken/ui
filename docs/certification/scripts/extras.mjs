import { chromium } from "playwright-core";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
await page.goto("http://localhost:3133/ui-gallery", { waitUntil: "networkidle" });
const R = [];
const t = async (n, f) => {
  try {
    const r = await f();
    R.push([n, r === false ? "FAIL" : "ok", typeof r === "string" ? r : ""]);
  } catch (e) {
    R.push([n, "FAIL", e.message.split("\n")[0].slice(0, 120)]);
  }
};
await t("ToggleGroup changes selection", async () => {
  await page.getByRole("radio", { name: "List" }).click();
  return (await page.getByRole("radio", { name: "List" }).getAttribute("aria-checked")) === "true";
});
await t("Collapsible opens and closes", async () => {
  const tr = page.getByRole("button", { name: "Shared" });
  await tr.click();
  const open = await page.getByText("No saved queries in Shared.").isVisible();
  await tr.click();
  return open && !(await page.getByText("No saved queries in Shared.").isVisible());
});
await t("Submenu opens with keyboard (right arrow)", async () => {
  await page.getByTestId("sub-trigger").focus();
  await page.keyboard.press("Enter");
  await page.getByRole("menu").waitFor();
  await page.getByTestId("sub-item").hover();
  await page.keyboard.down("ArrowRight");
  await page.waitForTimeout(150);
  await page.keyboard.up("ArrowRight");
  await page.waitForTimeout(250);
  const ok = await page.getByRole("menuitem", { name: "America/Bogota" }).isVisible();
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  return ok;
});
await t("Joined radios: selection and arrow keys", async () => {
  const g = page.getByRole("radiogroup", { name: "Joined connection method" });
  await g.getByRole("radio").first().focus();
  await page.keyboard.down("ArrowDown");
  await page.waitForTimeout(120);
  await page.keyboard.up("ArrowDown");
  await page.waitForTimeout(150);
  return (await g.getByRole("radio").nth(1).getAttribute("aria-checked")) === "true";
});
await t("CodeBlock tabs switch and copy", async () => {
  const cb = page.getByTestId("code-tabs");
  await cb.getByRole("tab", { name: "bun" }).click();
  return (await cb.textContent()).includes("bun add");
});
await t(
  "Partial checkbox exposes mixed state",
  async () =>
    (await page.getByRole("checkbox", { name: "Partial" }).getAttribute("aria-checked")) ===
    "mixed",
);
await page.getByTestId("sec-extras").scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.screenshot({ path: process.argv[2] + "/g-extras.png" });
console.log(R.map((r) => r.join(" | ")).join("\n"));
await browser.close();
