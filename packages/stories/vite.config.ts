import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import packageJson from "./package.json"

const currentYear = new Date().getFullYear()
const repoUrl = String(packageJson.repository?.url ?? "")
  .replace(/^git\+/, "")
  .replace(/^https?:\/\//, "")
  .replace(/\.git$/, "")

const banner = `/*
 * BrickSliderStories
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
      entry: "./src/index.ts",
      formats: ["es"],
      fileName: "brick-slider-stories"
    },
    rollupOptions: {
      output: {
        banner
      },
      external: ["@sixsrc/brick-slider", "@sixsrc/brick-slider/api"]
    }
  },
  plugins: [dts()]
})
