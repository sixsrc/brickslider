import { defineConfig } from "vite"
import { fileURLToPath, URL } from "node:url"
import dts from "vite-plugin-dts"
import { ViteMinifyPlugin } from "vite-plugin-minify"
// @ts-ignore
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url))
      },
      {
        find: "@sixsrc/brick-slider/plugin-api",
        replacement: fileURLToPath(new URL("./src/plugin-api.ts", import.meta.url))
      },
      {
        find: "@sixsrc/brick-slider",
        replacement: fileURLToPath(new URL("./src/index.ts", import.meta.url))
      },
      {
        find: "@sixsrc/brick-slider-accessibility",
        replacement: fileURLToPath(
          new URL("../accessibility/src/index.ts", import.meta.url)
        )
      },
      {
        find: "@sixsrc/brick-slider-stories",
        replacement: fileURLToPath(
          new URL("../stories/src/index.ts", import.meta.url)
        )
      }
    ]
  },
  build: {
    outDir: "lib",
    minify: true,
    lib: {
      name: "BrickSlider",
      entry: "./src/index.ts",
      formats: ["es", "cjs"],
      fileName: "brick-slider"
    },
    rolldownOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false
      }
    }
  },
  plugins: [dts(), tailwindcss(), ViteMinifyPlugin()]
})
