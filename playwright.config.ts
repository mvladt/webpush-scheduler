import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/playwright",
  timeout: 120000,
  use: {
    channel: "chrome",
    headless: false,
    launchOptions: {
      args: ["--ozone-platform=x11"],
    },
    permissions: ["notifications"],
  },
});
