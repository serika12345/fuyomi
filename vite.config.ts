/// <reference types="vitest/config" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  base: "./",
  plugins: [react()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  clearScreen: false,
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
  },
  server: {
    port: 1420,
    strictPort: true,
  },
});
