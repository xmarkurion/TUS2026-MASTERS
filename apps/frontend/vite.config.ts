/// <reference types="vitest" />
/// <reference types="vite/client" />

import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import { test } from "vitest"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: env.VITE_BASE_URL || "/",
    plugins: [react(), tailwindcss()],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/vitest.setup.ts"],
      css: true,
      testTimeout: 5000,
      reporters: "verbose",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
