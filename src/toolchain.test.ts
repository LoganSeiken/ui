import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file: string) => readFileSync(path.join(root, file), "utf8");
const pkg = JSON.parse(read("package.json")) as {
  engines?: { node?: string };
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};
const specs = { ...pkg.dependencies, ...pkg.devDependencies };
const exact = /^\d+\.\d+\.\d+(-[A-Za-z0-9.-]+)?$/;

describe("node and package toolchain", () => {
  it("pins Node 24 in .nvmrc and engines", () => {
    expect(read(".nvmrc").trim()).toBe("24");
    expect(pkg.engines?.node).toBe(">=24 <25");
  });

  it("enforces engines and exact saves through .npmrc", () => {
    const lines = read(".npmrc")
      .split(/\r?\n/)
      .map((line) => line.trim());
    expect(lines).toContain("engine-strict=true");
    expect(lines).toContain("save-exact=true");
  });

  it("uses @types/node on the Node 24 line", () => {
    expect(specs["@types/node"]).toMatch(/^24\.\d+\.\d+$/);
  });

  it("declares exact versions for every direct dependency", () => {
    const loose = Object.entries(specs).filter(
      ([, spec]) => !spec.startsWith("file:") && !exact.test(spec),
    );
    expect(loose).toEqual([]);
  });

  it("reads the Node version from .nvmrc in CI", () => {
    const folder = path.join(root, ".github/workflows");
    expect(existsSync(folder)).toBe(true);
    const text = readdirSync(folder)
      .filter((name) => /\.ya?ml$/.test(name))
      .map((name) => readFileSync(path.join(folder, name), "utf8"))
      .join("\n");
    expect(text).not.toMatch(/^\s*(-\s*)?node-version:\s*\S/m);
    expect(text).toMatch(/^\s*(-\s*)?node-version-file:\s*\S/m);
  });
});
