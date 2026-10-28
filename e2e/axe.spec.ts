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
  test(`${target.title} ${target.id} has no WCAG violations`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${target.id}&viewMode=story&globals=theme:light`);
    await page.locator("#storybook-root > *").first().waitFor();
    const hasAxe = await page.evaluate(
      () => typeof (window as unknown as { axe?: { run?: unknown } }).axe?.run === "function",
    );
    if (!hasAxe) {
      await page.addScriptTag({ content: axe.source });
    }
    await page.waitForFunction(
      () => {
        const runner = (window as unknown as { axe?: { _running?: boolean } }).axe;
        return Boolean(runner?.run) && !runner?._running;
      },
      undefined,
      { timeout: 10_000 },
    );
    const result = await page.evaluate(async () =>
      (window as unknown as { axe: typeof axe }).axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
      }),
    );
    expect(result.violations).toEqual([]);
  });
}
