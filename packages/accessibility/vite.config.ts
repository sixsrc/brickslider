import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  build: {
    outDir: "lib",
    minify: true,
    lib: {
      name: "BrickSliderAccessibility",
      entry: "./src/index.ts",
      formats: ["es", "cjs"],
      fileName: "brick-slider-accessibility"
    },
    rollupOptions: {
      external: ["@sixsrc/brick-slider", "@sixsrc/brick-slider/plugin-api"],
      output: {
        exports: "named"
      }
    }
  },
  plugins: [dts()]
})
