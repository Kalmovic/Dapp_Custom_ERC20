import { configDefaults, defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    css: true,
    reporters: ["verbose"],
    setupFiles: "./src/setupTests.ts",
    coverage: {
      reporter: ["text", "json", "html"],
      include: ["src/**/*"],
      exclude: [],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Align with Vite's alias
    },
    // Make sure Vitest knows to resolve these extensions
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
});
