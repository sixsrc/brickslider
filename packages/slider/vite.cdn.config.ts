import { defineConfig } from "vite"
import { ViteMinifyPlugin } from "vite-plugin-minify"

export default defineConfig({
  build: {
    outDir: "lib",
    minify: true,
    lib: {
      name: "BrickSlider",
      entry: "./src/cdn-core.ts",
      formats: ["umd"],
      fileName: "brick-slider"
    },
    rolldownOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false
      }
    }
  },
  plugins: [ViteMinifyPlugin()]
})
