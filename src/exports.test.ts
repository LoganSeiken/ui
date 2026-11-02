import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const sourceRoot = path.join(root, "src/components");
const componentExports = () => {
  const publicEntry = readFileSync(path.join(root, "src/index.ts"), "utf8");
  const barrels = [
    ...publicEntry.matchAll(
      /export\s+\*\s+from\s+["']\.\/components\/(ui|patterns|layout)\/index\.js["']/g,
    ),
  ];
  const components = new Map<string, { directory: string; module: string }>();
  for (const barrel of barrels) {
    const directory = barrel[1]!;
    const content = readFileSync(path.join(sourceRoot, directory, "index.ts"), "utf8");
    const exports = /export\s+(type\s+)?\{([\s\S]*?)\}\s+from\s+["']\.\/([^"']+)\.js["']/g;
    for (const match of content.matchAll(exports)) {
      if (match[1]) continue;
      const module = match[3]!;
      for (const statement of match[2]!.split(",")) {
        const exportName = statement
          .trim()
          .split(/\s+as\s+/)
          .at(-1)
          ?.trim();
        if (exportName && /^[A-Z]/.test(exportName))
          components.set(exportName, { directory, module });
      }
    }
  }
  return [...components].map(([name, source]) => ({ name, ...source }));
};

function filesUnder(directory: string, suffix: string): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return filesUnder(target, suffix);
    return target.endsWith(suffix) ? [target] : [];
  });
}

describe("public UI component evidence", () => {
  it("requires a story for every exported component and unit or dynamic visual evidence", () => {
    const components = componentExports();
    const sourceTests = filesUnder(path.join(root, "src"), ".test.ts").concat(
      filesUnder(path.join(root, "src"), ".test.tsx"),
    );
    const visual = readFileSync(path.join(root, "e2e/visual.spec.ts"), "utf8");
    const visualCoversEveryStory =
      /for\s*\(const\s+story\s+of\s+stories\)/.test(visual) &&
      /\$\{story\.id\}\s+light/.test(visual);
    const assessed = components.map((component) => {
      const storyPath = path.join(
        sourceRoot,
        component.directory,
        `${component.module}.stories.tsx`,
      );
      const storyExists = existsSync(storyPath) || existsSync(storyPath.replace(/\.tsx$/, ".ts"));
      const unitTestExists = sourceTests.some((file) =>
        new RegExp(`\\b${component.name}\\b`).test(readFileSync(file, "utf8")),
      );
      return {
        ...component,
        storyExists,
        unitTestExists,
        visualExists: storyExists && visualCoversEveryStory,
      };
    });
    const missingStories = assessed
      .filter(({ storyExists }) => !storyExists)
      .map(({ name }) => name);
    const missingUnitTests = assessed
      .filter(({ unitTestExists }) => !unitTestExists)
      .map(({ name }) => name);
    const missingVisual = assessed
      .filter(({ visualExists }) => !visualExists)
      .map(({ name }) => name);
    console.info(
      `UI export evidence: components=${assessed.length}, missingStories=${missingStories.length}, missingUnitTests=${missingUnitTests.length}, missingVisual=${missingVisual.length}`,
    );
    expect(missingStories, `missing Storybook stories: ${missingStories.join(", ")}`).toEqual([]);
    expect(
      assessed
        .filter(({ unitTestExists, visualExists }) => !unitTestExists && !visualExists)
        .map(({ name }) => name),
      "components without a naming unit test or a story covered by the visual journey",
    ).toEqual([]);
  });
});
