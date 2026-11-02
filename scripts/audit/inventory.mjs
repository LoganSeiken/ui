import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import ts from "typescript";
const root = process.cwd();
const dirs = ["src/components/ui", "src/components/patterns"];
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
const sourceFiles = dirs
  .flatMap((d) => walk(path.join(root, d)))
  .filter((f) => /\.tsx$/.test(f) && !/\.(test|stories)\.tsx$/.test(f))
  .sort();
const supportFiles = walk(path.join(root, "src"))
  .filter((f) => /\.(test|stories)\.tsx$/.test(f))
  .map((f) => ({ file: f, text: fs.readFileSync(f, "utf8") }));
const exportsIndex =
  fs.readFileSync(path.join(root, "src/components/ui/index.ts"), "utf8") +
  fs.readFileSync(path.join(root, "src/components/patterns/index.ts"), "utf8");
function appUsage(repo) {
  const repoPath = path.resolve(root, "..", repo);
  let names = "";
  try {
    names = execFileSync(
      "git",
      ["-C", repoPath, "grep", "-l", "@loganseiken/ui", "develop", "--", "app", "src"],
      { encoding: "utf8" },
    );
  } catch {
    return {};
  }
  const counts = {};
  for (const entry of names.trim().split("\n").filter(Boolean)) {
    const file = entry.slice(entry.indexOf(":") + 1);
    if (/\.(test|spec|stories)\./.test(file)) continue;
    const content = execFileSync("git", ["-C", repoPath, "show", `develop:${file}`], {
      encoding: "utf8",
    });
    for (const match of content.matchAll(
      /import\s*\{([^}]*)\}\s*from\s*["']@loganseiken\/ui["']/g,
    )) {
      for (const raw of match[1].split(",")) {
        const item = raw.trim();
        if (!item || item.startsWith("type ")) continue;
        const [name, alias] = item.split(/\s+as\s+/);
        const symbol = alias ?? name;
        const n = [...content.matchAll(new RegExp(`<${symbol}(?=[\\s/>])`, "g"))].length;
        counts[name] = (counts[name] ?? 0) + n;
      }
    }
  }
  return counts;
}
const usage = { crm: appUsage("crm"), recep: appUsage("recep") };
const configPath = ts.findConfigFile(root, ts.sys.fileExists, "tsconfig.json");
const config = ts.readConfigFile(configPath, ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const program = ts.createProgram(sourceFiles, { ...parsed.options, noEmit: true });
const checker = program.getTypeChecker();
const entries = [];
for (const file of sourceFiles) {
  const code = fs.readFileSync(file, "utf8");
  const sf = program.getSourceFile(file);
  if (!sf) throw new Error(`Missing source: ${file}`);
  const names = [],
    types = [];
  for (const node of sf.statements) {
    const exported = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!exported) continue;
    if ((ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) && node.name)
      names.push(node.name.text);
    if (ts.isVariableStatement(node))
      for (const d of node.declarationList.declarations)
        if (ts.isIdentifier(d.name)) names.push(d.name.text);
    if ((ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) && node.name)
      types.push(node.name.text);
  }
  const stem = file.slice(0, -4),
    story = `${stem}.stories.tsx`,
    test = `${stem}.test.tsx`;
  const fileBase = path.basename(stem);
  const indexExport = exportsIndex.includes(`./${fileBase}.js`);
  const barrelNames = new Set();
  for (const match of exportsIndex.matchAll(
    /export\s+(?:type\s+)?\{([^}]+)\}\s+from\s+["']\.\/([^"']+)\.js["']/gs,
  )) {
    if (match[2] !== fileBase) continue;
    for (const part of match[1].split(","))
      barrelNames.add(
        part
          .trim()
          .replace(/^type\s+/, "")
          .split(/\s+as\s+/)
          .at(-1),
      );
  }
  const publicExports = names.filter((name) => barrelNames.has(name));
  const declarations = [...names, ...types];
  const supportFor = (name, suffix) =>
    supportFiles
      .filter(
        ({ file: supportFile, text }) =>
          supportFile.endsWith(suffix) && new RegExp(`\\b${name}\\b`).test(text),
      )
      .map(({ file: supportFile }) => path.relative(root, supportFile));
  const props = [
    ...new Set([...code.matchAll(/\b(?:type|interface)\s+(\w*Props)\b/g)].map((m) => m[1])),
  ];
  const publicProps = {};
  const moduleSymbol = checker.getSymbolAtLocation(sf);
  for (const symbol of moduleSymbol ? checker.getExportsOfModule(moduleSymbol) : []) {
    if (!names.includes(symbol.name)) continue;
    const signature = checker.getTypeOfSymbolAtLocation(symbol, sf).getCallSignatures()[0];
    const param = signature?.getParameters()[0];
    if (!param) continue;
    const propsType = checker.getTypeOfSymbolAtLocation(param, sf);
    publicProps[symbol.name] = checker
      .getPropertiesOfType(propsType)
      .filter((prop) =>
        prop.declarations?.some((decl) =>
          decl.getSourceFile().fileName.startsWith(path.join(root, "src")),
        ),
      )
      .map((prop) => prop.name)
      .sort();
  }
  const variants = [
    ...new Set(
      [
        ...code.matchAll(
          /\b(?:variant|size|orientation|asChild|forwardRef|onChange|onValueChange)\b|aria-[a-z-]+/g,
        ),
      ].map((m) => m[0]),
    ),
  ];
  entries.push({
    file: path.relative(root, file),
    names,
    types,
    propTypes: props,
    publicProps,
    apiMarkers: variants,
    stories: Object.fromEntries(
      declarations.map((name) => [name, supportFor(name, ".stories.tsx")]),
    ),
    unitTests: Object.fromEntries(
      declarations.map((name) => [name, supportFor(name, ".test.tsx")]),
    ),
    accessibilityTests: Object.fromEntries(
      declarations.map((name) => [
        name,
        supportFiles
          .filter(
            ({ file: supportFile, text }) =>
              supportFile.endsWith(".test.tsx") &&
              new RegExp(`\\b${name}\\b`).test(text) &&
              (/a11y|accessib|axe/i.test(supportFile) || /toHaveNoViolations|axe\s*\(/i.test(text)),
          )
          .map(({ file: supportFile }) => path.relative(root, supportFile)),
      ]),
    ),
    semanticTests: Object.fromEntries(
      declarations.map((name) => [
        name,
        supportFiles
          .filter(
            ({ file: supportFile, text }) =>
              supportFile.endsWith(".test.tsx") &&
              new RegExp(`\\b${name}\\b`).test(text) &&
              /aria-|getByRole|toHaveAccessible/i.test(text),
          )
          .map(({ file: supportFile }) => path.relative(root, supportFile)),
      ]),
    ),
    sameStemStory: fs.existsSync(story),
    sameStemUnitTest: fs.existsSync(test),
    exportedInBarrel: indexExport,
    publicExports,
    crmJsxUsages: Object.fromEntries(names.map((n) => [n, usage.crm[n] ?? 0])),
    recepJsxUsages: Object.fromEntries(names.map((n) => [n, usage.recep[n] ?? 0])),
  });
}
console.log(
  JSON.stringify(
    {
      method:
        "Static source declarations, named references across stories/tests, public barrels and JSX usage at develop; test references are not proof each behavior runs or is accessible.",
      filesByCategory: Object.fromEntries(
        dirs.map((dir) => [dir, sourceFiles.filter((file) => file.includes(`${dir}/`)).length]),
      ),
      entries,
    },
    null,
    2,
  ),
);
