import { defineConfig } from "vite"

export default defineConfig({
  publicDir: false,
  build: {
    outDir: "lib",
    minify: true,
    lib: {
      name: "BrickSliderStories",
      entry: "./src/cdn.ts",
      formats: ["umd"],
      fileName: "brick-slider-stories"
    },
    rollupOptions: {
      external: ["@sixsrc/brick-slider/plugin-api"],
      output: {
        exports: "default",
        globals: {
          "@sixsrc/brick-slider/plugin-api": "BrickSliderPluginApi"
        }
      }
    }
  }
})
