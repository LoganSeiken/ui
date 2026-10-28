import { expect, test } from "@playwright/test";

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1100, height: 640 },
]) {
  test(`ActionForm inside CenteredPage ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(
      "/iframe.html?id=patterns-actionform--inside-centered-page&viewMode=story&globals=theme:light",
    );
    await page.locator("#storybook-root > *").first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    await expect(page).toHaveScreenshot(`action-form-inside-centered-page-${viewport.name}.png`);
  });
}
