import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const walk = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const p = path.join(dir, entry.name);
        return entry.isDirectory() ? walk(p) : [p];
      })
    : [];
const files = ["app", "src"]
  .flatMap((dir) => walk(path.join(root, dir)))
  .filter((p) => /\.[jt]sx?$/.test(p) && !/\.(?:test|spec|stories)\.[jt]sx?$/.test(p));
const items = [];
for (const file of files) {
  const text = fs.readFileSync(file, "utf8"),
    lines = text.split("\n");
  const rel = path.relative(root, file);
  const add = (kind, line, snippet) =>
    items.push({ kind, file: rel, line, snippet: snippet.trim().slice(0, 180) });
  if (/^\s*["']use client["']/m.test(text)) {
    if (lines.length > 200) add("client-over-200-lines", 1, `${lines.length} lines`);
    if (
      !/\buse(?:State|Effect|ActionState|Reducer|Transition|Optimistic|Ref|SyncExternalStore|Router|Pathname|SearchParams|Translations|Locale|FormStatus|Id)\b|\bon[A-Z]\w*\s*=/.test(
        text,
      )
    )
      add(
        "client-without-detected-hooks-or-events",
        1,
        "Review imports, transitive dependencies and client-only APIs manually",
      );
  }
  if (/from\s+["']next\/dynamic["']|\bnext\/dynamic\b/.test(text))
    add(
      "dynamic-import-review",
      1,
      "Next dynamic import present; review whether server or lazy loading is possible",
    );
  if (/\bSuspense\b/.test(text))
    add(
      "suspense-review",
      1,
      "Suspense token present; verify the boundary and streamed work manually",
    );
  if (/from\s+["']next\/image["']/.test(text))
    add("next-image-review", 1, "next/image import present");
  if (/eslint-disable/.test(text))
    add(
      "eslint-disable-review",
      lines.findIndex((line) => /eslint-disable/.test(line)) + 1,
      "Inline ESLint suppression requires manual review",
    );
  lines.forEach((line, index) => {
    if (/\buseEffect\s*\(/.test(line)) {
      const body = lines.slice(index, index + 24).join("\n");
      const kind = /\bfetch\s*\(/.test(body)
        ? "fetch-or-network"
        : /set[A-Z]\w*\s*\(/.test(body)
          ? "state-write"
          : /setInterval|addEventListener|subscribe/.test(body)
            ? "external-subscription"
            : "other";
      add(`effect-review-${kind}`, index + 1, line);
    }
    if (/\bkey\s*=\s*\{\s*(?:index|idx|i)\s*\}/.test(line))
      add("index-key-review-dynamic-vs-static", index + 1, line);
    if (/\b(?:memo|useMemo|useCallback)\s*\(/.test(line)) add("memo-review", index + 1, line);
    if (/\w+\s*=\s*\{\s*(?:\{|\[|\([^)]*\)\s*=>)/.test(line))
      add("literal-prop-review", index + 1, line);
    if (
      /from\s+["']@loganseiken\/ui["']/.test(text) &&
      /\w+\s*=\s*\{\s*(?:\{|\[|\([^)]*\)\s*=>)/.test(line)
    )
      add("ui-literal-prop-review", index + 1, line);
    if (/\.map\s*\(/.test(line) && !/Pagination|virtual|range\(|limit\(/i.test(text))
      add("list-bound-review", index + 1, line);
    if (/from\s+["']lucide-react["']/.test(line) && !/\bimport\s*\{/.test(line))
      add("lucide-import-review", index + 1, line);
  });
}
console.log(
  JSON.stringify(
    {
      method:
        "Lexical candidate scan, not a finding or proof. Review multi-line constructs and transitive behavior manually.",
      files: files.length,
      items,
    },
    null,
    2,
  ),
);
