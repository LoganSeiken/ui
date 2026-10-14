import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  workers: 4,
  reporter: [["list"]],
  expect: { toHaveScreenshot: { animations: "disabled", maxDiffPixelRatio: 0.002 } },
  use: {
    baseURL: "http://localhost:6007",
    channel: "chrome",
    viewport: { width: 1100, height: 640 },
    deviceScaleFactor: 1,
    locale: "en-US",
    timezoneId: "UTC"
  },
  projects: [{ name: "chrome" }],
  webServer: {
    command: "node e2e/serve-static.mjs",
    url: "http://localhost:6007",
    reuseExistingServer: true
  }
});
