import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

type Entry = { id: string; title: string; type: string };

const index = JSON.parse(readFileSync("storybook-static/index.json", "utf8")) as { entries: Record<string, Entry> };
const stories = Object.values(index.entries).filter((entry) => entry.type === "story");
const firstOfEachComponent = new Set<string>();
const darkStories = stories.filter((story) => {
  if (firstOfEachComponent.has(story.title)) return false;
  firstOfEachComponent.add(story.title);
  return true;
});

async function openStory(page: Page, id: string, theme: "light" | "dark") {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
  await page.locator("#storybook-root > *").first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
}

for (const story of stories) {
  test(`${story.id} light`, async ({ page }) => {
    await openStory(page, story.id, "light");
    await expect(page).toHaveScreenshot(`${story.id}-light.png`);
  });
}

for (const story of darkStories) {
  test(`${story.id} dark`, async ({ page }) => {
    await openStory(page, story.id, "dark");
    await expect(page).toHaveScreenshot(`${story.id}-dark.png`);
  });
}
