import { defineConfig } from "vite"
import packageJson from "./package.json"

const currentYear = new Date().getFullYear()
const repoUrl = String(packageJson.repository?.url ?? "")
  .replace(/^git\+/, "")
  .replace(/^https?:\/\//, "")
  .replace(/\.git$/, "")

const banner = `/*
 * BrickSliderAccessibility
 * Version  : ${packageJson.version}
 * License  : ${packageJson.license}
 * Copyright: ${currentYear}
 * Repo: ${repoUrl}
 */
`

export default defineConfig({
  publicDir: false,
  build: {
    outDir: "lib",
    minify: true,
    lib: {
      entry: "./src/browser.ts",
      formats: ["iife"],
      name: "BrickSliderAccessibilityBundle",
      fileName: () => "brick-slider-accessibility.browser.js"
    },
    rollupOptions: {
      external: ["@sixsrc/brick-slider/api"],
      output: {
        banner,
        globals: {
          "@sixsrc/brick-slider/api": "BrickSliderApi"
        }
      }
    }
  }
})
