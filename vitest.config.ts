import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: "./test/setup.ts",
    reporters: ["verbose"],
    environment: "node",
    globals: true,
    silent: false,
    testTimeout: 10000,
    hookTimeout: 10000,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "test/", "**/*.test.ts", "prisma/"],
    },
  },
});
