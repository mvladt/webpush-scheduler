import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/playwright",
  timeout: 120000,
  use: {
    channel: "chrome",
    headless: !!process.env.CI,
    launchOptions: {
      args: process.env.CI ? [] : ["--ozone-platform=x11"],
    },
    permissions: ["notifications"],
  },
});
