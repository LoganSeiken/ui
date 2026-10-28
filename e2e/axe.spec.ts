import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import axe from "axe-core";

const index = JSON.parse(readFileSync("storybook-static/index.json", "utf8")) as {
  entries: Record<string, { id: string; title: string; type: string }>;
};

const targets = Object.values(index.entries).filter(
  (entry) =>
    entry.type === "story" &&
    (entry.title === "patterns/KanbanBoard" || entry.title === "patterns/MessageThread"),
);

for (const target of targets) {
  test(`${target.title} has no WCAG violations`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${target.id}&viewMode=story&globals=theme:light`);
    await page.locator("#storybook-root > *").first().waitFor();
    await page.addScriptTag({ content: axe.source });
    const result = await page.evaluate(async () =>
      (window as unknown as { axe: typeof axe }).axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
      }),
    );
    expect(result.violations).toEqual([]);
  });
}
