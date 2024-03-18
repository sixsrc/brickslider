import { defineConfig } from "vite"
import { resolve } from "path"
import dts from "vite-plugin-dts"
import { ViteMinifyPlugin } from "vite-plugin-minify"

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "src")
      }
    ]
  },
  build: {
    minify: true,
    lib: {
      name: "BrickSlider",
      entry: "./src/index.ts",
      formats: ["es", "cjs", "umd"],
      fileName: "brick-slider"
    }
  },
  plugins: [dts(), ViteMinifyPlugin()]
})